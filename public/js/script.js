function makeRazorpayPayment(order){
    const options ={
        key:"rzp_test_HlwQdRNHUPitjP",
        amount:order.amount_due,
        currency: "INR",
        name: "Pretty Finds Pvt Ltd",
        description: "Test Transaction",
        image: "https://example.com/your_logo",
        order_id: `${order.id}`,
        handler: function (response) {
            alert(response.razorpay_payment_id)
            alert(response.razorpay_order_id)
            alert(response.razorpay_order_id);

      
            verifyPayment(response, order);
          },
          prefill: { 
            name: "Gopika Manoj", //your customer's name
            email: "gopikamanoj008@gmail.com",
            contact: "9755627700",
          },
          notes: {
            address: "Razorpay Corporate Office",
          },
          theme: {
            color: "#3399cc",
          },
    }

    const rzp1 = new Razorpay(options);
    rzp1.open();
}


function verifyPayment(payment, order){
    $.ajax({
        url: "/verify-payment",
        data: {
            payment,
            order
        },
        type: "POST"
    }).done((res) =>{
        alert("Order has been successfully placed");
        location.href = "/confirm-page"
    }).fail((err) =>{
        alert("Sorry! Order has not been placed...");
        location.href = "/checkout-page";
    })
}