const cart=JSON.parse(localStorage.getItem("cart")) || [];

const counter= document.getElementById("count");


const totalcart=document.getElementById("view-cart");

const cartItems=document.getElementById("cart-items");

const amountbox=document.getElementById("amount-box");


function renderCart() {

    totalcart.innerHTML = ''; 


    cart.forEach(product => {
        totalcart.innerHTML += `
            <div class="cart-product display pb-4 border-bottom mt-2">
                <div>
                    <img src="${product.imageUrl}" alt="${product.description}">
                </div>
                <div>
                    <h4 class="mb-0">${product.description}</h4>
                    <span class="itemQuanity">
                        ${product.quantity} × 
                        <bdi>$${product.price}</bdi>
                    </span>
                </div>
            </div>
        `;
    });

    let totalAmount = cart.reduce((sum, product) => {
        return sum + (product.quantity * parseFloat(product.price));
    }, 0);
    
    totalcart.innerHTML += `
        <p class="mt-2 mb-3 display">
            <strong>Total:</strong>
            <bdi>$${totalAmount.toFixed(2)}</bdi>
        </p>

        <p class="mb-0 pb-0 display justify-content-between">
            <a class="btn" href="#total-items">View Cart</a>
            <button class="btn">Checkout</button>
        </p>
    `;
}


document.addEventListener("DOMContentLoaded",function(){
    counter.innerHTML=cart.length;
    renderCart();

    cart.forEach((prod,idx)=>{


        let subtotal= prod.quantity * prod.price;

        function getCartTotal() {
            return cart.reduce((acc, item) => 
                acc + item.quantity * parseFloat(item.price)
            , 0);
        }
        cartItems.innerHTML +=
        
        `

                        <div class="row align-items-center cart-item py-3 border-bottom">
                            <div class="col-sm-5  d-flex align-items-center">
                                <img src="${prod.imageUrl}" class="me-3 w-25" alt="${prod.name}" class="img-fluid">
                                <span>${prod.description}</span>
                            </div>
                                <div class="col-6 col-sm-2 fw-semibold price">$${prod.price}</div>
                                <div class="col-6 col-sm-2">
                                    <div class="quantity-box d-flex justify-content-center align-items-center">
                                        <button class="display minus" onclick="showMessage('Product is deleted successfully from the cart.','bottom-start')"><i class="ri-subtract-line"></i></button>
                                        <p class="m-0 ps-3 pe-3 fw-bold text-dark qty">${prod.quantity}</p>
                                        <button class="display plus" onclick="showMessage('Product is added successfully into the cart.','bottom-start')"><i class="ri-add-line"></i></button>
                                    </div>
                                </div>
                                <div class="col-6 col-sm-2 subtotal fw-semibold text-center subtotal">$${subtotal}</div>
                                <div class="col-6 col-sm-1">
                                    <button class="btn text-black cross-btn">×</button>
                                </div>
                        </div>
        
        `

        amountbox.innerHTML=`
             <h5 class="fw-semibold">Cart totals</h5>
                    <div class="display mt-5 mb-4">
                        <h6 class="fw-semibold">Total</h6>
                        <span id="sum" class="fw-semibold">$${getCartTotal().toFixed(2)}</span>
                    </div>
                <button>Procced to checkout</button>
        `

    })


    const cartItemDivs = document.querySelectorAll(".cart-item");
     cartItemDivs.forEach((items,idx) => {
        
        const plusBtn=items.querySelector(".plus");
        const minusBtn=items.querySelector(".minus");
        const quantity=items.querySelector(".qty");
        const subtotal=items.querySelector(".subtotal");
        const crossBtn=items.querySelector(".cross-btn");


        let qty = cart[idx].quantity;
        let price = cart[idx].price;

        function updateSubtotal() {
            subtotal.textContent = (qty * price).toFixed(2);
            renderCart();
            localStorage.setItem("cart", JSON.stringify(cart));
        }
        function updateCartTotal() {
            let total = cart.reduce((acc, item) => 
                acc + item.quantity * parseFloat(item.price)
            ,0);
            document.getElementById("sum").textContent = `$${total.toFixed(2)}`;
        }

        plusBtn.addEventListener("click", () => {
            qty++;
            cart[idx].quantity = qty;
            quantity.textContent = qty;
            updateSubtotal();
            updateCartTotal() ;
        });


         minusBtn.addEventListener("click", () => {
            qty--;
            if (qty <= 0) {
                cart.splice(idx, 1);
                items.remove();
            } else {
                cart[idx].quantity = qty;
                quantity.textContent = qty;
            }
            updateSubtotal();
            updateCartTotal();
            counter.innerHTML = cart.length;
            localStorage.setItem("cart", JSON.stringify(cart));
        });

         crossBtn.addEventListener("click", () => {
            const itemIndex = cart.findIndex(p => p.idx === items.idx);

            if(itemIndex > -1) {
                cart.splice(itemIndex, 1); 
                localStorage.setItem("cart", JSON.stringify(cart)); 
                items.remove(); 
                renderCart();   
                updateCartTotal(); 
                counter.innerHTML = cart.length; 
            }
        });

    });
})


showMessage = (
    msg = 'Product is added successfully into the cart.',
    position = 'bottom-start',
    showCloseButton = true,
    duration = 3000
) => {
    const toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: duration,
        showCloseButton: showCloseButton,
    });

    toast.fire({
        title: msg,
    });
};