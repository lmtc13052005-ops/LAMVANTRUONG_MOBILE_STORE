namespace CMS.Backend.Models.Api
{
    // DTO nhận dữ liệu đặt hàng từ ReactJS (Buổi 11 — #29, #30, #31).
    public class CreateOrderRequest
    {
        public int CustomerId { get; set; }
        // Thông tin giao hàng (#29 validate phía frontend)
        public string FullName { get; set; } = "";
        public string Phone { get; set; } = "";
        public string Address { get; set; } = "";
        public string? CustomerEmail { get; set; }
        public string? Notes { get; set; }
        public List<OrderItemRequest> Items { get; set; } = new();
    }

    public class OrderItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}
