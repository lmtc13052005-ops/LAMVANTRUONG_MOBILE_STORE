using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Backend.Models;

namespace CMS.Backend.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly ApplicationDbContext _context;

    public HomeController(ILogger<HomeController> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult Index()
    {
        var latestPosts = _context.Posts
                          .Include(p => p.Category)
                          .OrderByDescending(p => p.CreatedDate)
                          .Take(3)
                          .ToList();
        return View(latestPosts);
    }

    [Authorize]
    public IActionResult Dashboard()
    {
        // Thống kê tổng
        ViewBag.ProductCount = _context.Products.Count();
        ViewBag.PostCount = _context.Posts.Count();
        ViewBag.OrderCount = _context.Orders.Count();
        ViewBag.CustomerCount = _context.Customers.Count();
        ViewBag.CategoryProductCount = _context.CategoriesProducts.Count();
        ViewBag.UserCount = _context.Users.Count();

        // Đơn hàng chờ duyệt
        ViewBag.PendingOrders = _context.Orders.Count(o => o.Status == 0);

        // Tổng doanh thu
        ViewBag.TotalRevenue = _context.Orders
            .Where(o => o.Status == 2)
            .Sum(o => (decimal?)o.TotalAmount) ?? 0m;

        // Đơn hàng 6 tháng gần nhất (nhãn + số lượng)
        var now = DateTime.Now;
        var monthLabels = Enumerable.Range(5, -6 < 0 ? 6 : 6)
            .Select(i => now.AddMonths(-5 + i))
            .ToList();

        var ordersPerMonth = monthLabels.Select(m => _context.Orders
            .Count(o => o.OrderDate.Year == m.Year && o.OrderDate.Month == m.Month))
            .ToList();

        var revenuePerMonth = monthLabels.Select(m => (double)(_context.Orders
            .Where(o => o.Status == 2 && o.OrderDate.Year == m.Year && o.OrderDate.Month == m.Month)
            .Sum(o => (decimal?)o.TotalAmount) ?? 0m))
            .ToList();

        ViewBag.MonthLabels = System.Text.Json.JsonSerializer.Serialize(
            monthLabels.Select(m => m.ToString("MM/yyyy")).ToList());
        ViewBag.MonthlyOrders = System.Text.Json.JsonSerializer.Serialize(ordersPerMonth);
        ViewBag.MonthlyRevenue = System.Text.Json.JsonSerializer.Serialize(revenuePerMonth);

        // 6 đơn hàng gần nhất
        ViewBag.RecentOrders = _context.Orders
            .Include(o => o.Customer)
            .OrderByDescending(o => o.OrderDate)
            .Take(6)
            .ToList();

        return View();
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
