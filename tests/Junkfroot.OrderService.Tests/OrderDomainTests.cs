using Junkfroot.OrderService.Domain;
using Xunit;

namespace Junkfroot.OrderService.Tests;

public class OrderDomainTests
{
    [Fact]
    public void New_Order_Has_Pending_Status()
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            OrderNumber = "JF-20260225-1234"
        };

        Assert.Equal(OrderStatus.Pending, order.Status);
    }

    [Fact]
    public void Order_Can_Contain_Multiple_Items()
    {
        var order = new Order
        {
            Id = Guid.NewGuid(),
            UserId = Guid.NewGuid(),
            OrderNumber = "JF-20260225-5678",
            Items =
            [
                new OrderItem { Id = Guid.NewGuid(), ProductName = "Trini Sunrise", UnitPrice = 9.99m, Quantity = 2, LineTotal = 19.98m },
                new OrderItem { Id = Guid.NewGuid(), ProductName = "Ginger Fire Shot", UnitPrice = 4.99m, Quantity = 1, LineTotal = 4.99m }
            ]
        };

        Assert.Equal(2, order.Items.Count);
        Assert.Equal(24.97m, order.Items.Sum(i => i.LineTotal));
    }

    [Fact]
    public void New_Payment_Has_Pending_Status()
    {
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrderId = Guid.NewGuid(),
            Amount = 24.97m
        };

        Assert.Equal(PaymentStatus.Pending, payment.Status);
        Assert.Equal("Square", payment.PaymentProvider);
    }
}
