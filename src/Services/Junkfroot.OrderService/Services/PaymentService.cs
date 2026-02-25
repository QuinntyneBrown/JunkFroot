using System.Net.Http.Json;
using Junkfroot.OrderService.Domain;
using Microsoft.Extensions.Options;

namespace Junkfroot.OrderService.Services;

public class SquarePaymentOptions
{
    public const string SectionName = "Square";
    public string AccessToken { get; set; } = string.Empty;
    public string LocationId { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = "https://connect.squareup.com";
}

public class PaymentService(
    HttpClient httpClient,
    IOptions<SquarePaymentOptions> options,
    ILogger<PaymentService> logger)
{
    private readonly SquarePaymentOptions _options = options.Value;

    public async Task<Payment> ProcessPayment(Guid orderId, decimal amount, string paymentToken)
    {
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrderId = orderId,
            Amount = amount,
            PaymentProvider = "Square",
            Status = PaymentStatus.Processing
        };

        try
        {
            var requestBody = new
            {
                idempotency_key = payment.Id.ToString(),
                source_id = paymentToken,
                amount_money = new
                {
                    amount = (long)(amount * 100), // Square uses cents
                    currency = "CAD"
                },
                location_id = _options.LocationId,
                reference_id = orderId.ToString(),
                note = "Junkfroot Order"
            };

            httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _options.AccessToken);

            var response = await httpClient.PostAsJsonAsync(
                $"{_options.BaseUrl}/v2/payments",
                requestBody);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<SquarePaymentResponse>();
                payment.ExternalPaymentId = result?.Payment?.Id;
                payment.Status = PaymentStatus.Completed;
                payment.CompletedAt = DateTime.UtcNow;

                logger.LogInformation(
                    "Payment {PaymentId} completed for order {OrderId}, amount {Amount} CAD, Square ID: {SquareId}",
                    payment.Id, orderId, amount, payment.ExternalPaymentId);
            }
            else
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                payment.Status = PaymentStatus.Failed;
                payment.FailureReason = $"Square API returned {response.StatusCode}: {errorBody}";

                logger.LogError(
                    "Payment failed for order {OrderId}: {StatusCode} - {Error}",
                    orderId, response.StatusCode, errorBody);
            }
        }
        catch (HttpRequestException ex)
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailureReason = $"Payment provider unavailable: {ex.Message}";
            logger.LogError(ex, "Payment provider unavailable for order {OrderId}", orderId);
        }
        catch (TaskCanceledException ex)
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailureReason = "Payment request timed out";
            logger.LogError(ex, "Payment request timed out for order {OrderId}", orderId);
        }

        return payment;
    }

    public async Task<Payment> RefundPayment(Payment payment)
    {
        try
        {
            if (string.IsNullOrEmpty(payment.ExternalPaymentId))
            {
                payment.FailureReason = "No external payment ID to refund";
                logger.LogWarning("Cannot refund payment {PaymentId}: no external payment ID", payment.Id);
                return payment;
            }

            var requestBody = new
            {
                idempotency_key = Guid.NewGuid().ToString(),
                payment_id = payment.ExternalPaymentId,
                amount_money = new
                {
                    amount = (long)(payment.Amount * 100),
                    currency = "CAD"
                },
                reason = "Customer refund"
            };

            httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _options.AccessToken);

            var response = await httpClient.PostAsJsonAsync(
                $"{_options.BaseUrl}/v2/refunds",
                requestBody);

            if (response.IsSuccessStatusCode)
            {
                payment.Status = PaymentStatus.Refunded;
                logger.LogInformation("Payment {PaymentId} refunded, Square ID: {SquareId}",
                    payment.Id, payment.ExternalPaymentId);
            }
            else
            {
                var errorBody = await response.Content.ReadAsStringAsync();
                payment.FailureReason = $"Refund failed: {errorBody}";
                logger.LogError("Refund failed for payment {PaymentId}: {Error}", payment.Id, errorBody);
            }
        }
        catch (Exception ex)
        {
            payment.FailureReason = $"Refund error: {ex.Message}";
            logger.LogError(ex, "Refund error for payment {PaymentId}", payment.Id);
        }

        return payment;
    }
}

internal class SquarePaymentResponse
{
    public SquarePaymentData? Payment { get; set; }
}

internal class SquarePaymentData
{
    public string? Id { get; set; }
    public string? Status { get; set; }
}
