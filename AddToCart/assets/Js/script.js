const products=[
    {
        id:1,
        type:"Bags, Fashion",
        description:"Horizon Herringbone Pants",
        imageUrl:"./assets/images/pd-fashon-19-300x400.jpg",
        price:"163.00",
    },
     {
        id:2,
        type:"Men,Sport",
        description:"Comet Corduroy Trousers",
        imageUrl:"./assets/images/pd-fashon-17-300x400.jpg",
        price:"135.00",
    },
     {
        id:3,
        type:"Clothes, Fashion",
        description:"Space Nightstand knit sweate...",
        imageUrl:"./assets/images/pd-fashon-18-300x400.jpg",
        price:"166.50",
    },
     {
        id:4,
        type:"Clothes, Hoodies",
        description:"Radiant Woolen Cardigan",
        imageUrl:"./assets/images/pd-fashon-16-300x400.jpg",
        price:"130.00",
    },
]

const productrow=document.getElementById("product-row");
const totalcart=document.getElementById("view-cart");


const cart=JSON.parse(localStorage.getItem("cart")) || [];

const counter= document.getElementById("count");

function UpdateCount(){
    counter.innerHTML=cart.length;
}

if (cart.length === 0) {
    totalcart.innerHTML = `<p class="pb-0 mb-0" style="font-size: 17px;">Your cart is empty.</p>`;
}

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
            <a class="btn" href="./viewcart.html">View Cart</a>
            <button class="btn">Checkout</button>
        </p>
    `;
}


function addtoCart(productID) {
    
    let eachproduct= products.find((product)=>{
        return product.id == productID ;
    })

    let index = cart.findIndex((pro)=>{
        return pro.id== productID;
    })

    if(index==-1){
        eachproduct.quantity=1;
        cart.push(eachproduct);
    }
    else{
        cart[index].quantity+=1;
    }

    localStorage.setItem("cart",JSON.stringify(cart));
    UpdateCount();
    renderCart();
}
products.forEach((products,idx)=>{

    productrow.innerHTML+=
    ` <div class="col-xl-3 col-lg-4 col-md-6">
            <div class="product position-relative">
                <div>
                    <img src="${products.imageUrl}" alt="" class="position-relative product-img">
                    <div class="display justify-content-center icons gap-3">
                        <div onclick="addtoCart(${products.id}) ; showMessage('Product is added successfully into the cart.','bottom-start')"><i class="ri-shopping-basket-2-line"></i></div>
                        
                        <div><i class="ri-heart-line"></i></div>
                        <div><i class="ri-arrow-left-right-line"></i></div>
                        <div><i class="ri-expand-diagonal-2-line"></i></div>
                    </div>
                </div>
                <div class="product-content">
                    <span class="product-type">${products.type}</span>
                    <h3 class="mt-2">${products.description}</h3>
                    <span class="price">$${products.price}</span>
                </div>
            </div>
        </div>
    `
})

UpdateCount();
renderCart();


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
