using Junkfroot.OrderService.Domain;

namespace Junkfroot.OrderService.Services;

public class PaymentService(ILogger<PaymentService> logger)
{
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
            // Square POS integration placeholder
            // In production, this would call the Square Payments API
            await Task.Delay(100); // Simulate API call

            payment.ExternalPaymentId = $"sq_{Guid.NewGuid():N}";
            payment.Status = PaymentStatus.Completed;
            payment.CompletedAt = DateTime.UtcNow;

            logger.LogInformation("Payment {PaymentId} completed for order {OrderId}, amount {Amount}",
                payment.Id, orderId, amount);
        }
        catch (Exception ex)
        {
            payment.Status = PaymentStatus.Failed;
            payment.FailureReason = ex.Message;

            logger.LogError(ex, "Payment failed for order {OrderId}", orderId);
        }

        return payment;
    }

    public async Task<Payment> RefundPayment(Payment payment)
    {
        // Square refund integration placeholder
        await Task.Delay(100);

        payment.Status = PaymentStatus.Refunded;
        logger.LogInformation("Payment {PaymentId} refunded", payment.Id);

        return payment;
    }
}
