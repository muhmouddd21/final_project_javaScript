
import { db, collection, getDocs } from "./config.js";

let isLoadingOrders = false;
let currentLoadingOperation = null;
let userIdFromLocal = localStorage.getItem("userId");


  async function getUserDataFromDB() {
    let user=[]
    const usersCollection = collection(db, "users");
    const userSnapshots = await getDocs(usersCollection);

    for (const userDoc of userSnapshots.docs) {
        if(userDoc.id ==userIdFromLocal){
             const userData = userDoc.data();
            const ordersCollection = collection(db, `users/${userDoc.id }/orders`);
            const ordersSnapshot = await getDocs(ordersCollection);
            const orders = ordersSnapshot.docs.map(orderDoc => ({
            id: orderDoc.id,
            ...orderDoc.data(),
            }));

            user.push({
            id: userDoc.id,
            ...userData,
            orders,  
            });
        }

    }
    return user;
    
}

     

function getFilteredOrders(users) {
    let filteredOrders =[];
  users.forEach((user) => {
    if (user.orders && user.orders.length > 0) {
      user.orders.forEach((order) => {
        filteredOrders.push({
          id: order.orderId,
          firstName:user.firstName,
          lastName:user.lastName,
          email:user.email,
          createdAt: new Date(user.createdAt),
          status: order.status,
          totalAmount: order.totalAmount,
          items: order.items || [],
        });
      });
    } else {
      filteredOrders.push({
        id: "none",
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email,
        createdAt: new Date(user.createdAt),
        status: "None",
        totalAmount: 0,
        items: [],
      });
    }
  });
  return filteredOrders; 
}
        

const ordersTableBody = document.getElementById('orders-table-body');
const noOrdersMessage = document.getElementById('no-orders-message');
const ordersLoading = document.getElementById('orders-loading');
const refreshOrdersBtn = document.getElementById('refresh-orders-btn');


async function loadOrdersSection() {
 
    if (isLoadingOrders) {
        console.log('Already loading orders, skipping...');
        return;
    }
    

    isLoadingOrders = true;
    

    const operationId = Date.now();
    currentLoadingOperation = operationId;
    
    try {
        showOrdersLoading(true);
        

        if (currentLoadingOperation !== operationId) {
            console.log('Load operation cancelled');
            return;
        }
        
        const users = await getUserDataFromDB();
        console.log('Users loaded:', users);
        
 
        if (currentLoadingOperation !== operationId) {
            console.log('Load operation cancelled after getUsersFromDB');
            return;
        }
        
        const filteredOrders = getFilteredOrders(users);
        console.log('Filtered orders:', filteredOrders);
        

        if (currentLoadingOperation !== operationId) {
            console.log('Load operation cancelled before rendering');
            return;
        }
        
        renderOrders(filteredOrders);
        showOrdersLoading(false);
        
    } catch (error) {
        console.error('Error loading orders:', error);
        showOrdersLoading(false);
  
    } finally {

        if (currentLoadingOperation === operationId) {
            isLoadingOrders = false;
            currentLoadingOperation = null;
        }
    }
}

 
function showOrdersLoading(show) {
    if (show) {
        ordersLoading.classList.remove('d-none');
        ordersTableBody.innerHTML = '';
        noOrdersMessage.classList.add('d-none');
    } else {
        ordersLoading.classList.add('d-none');
    }
}


function renderOrders(orders) {
    ordersTableBody.innerHTML = '';
    
    if (orders.length === 0) {
        noOrdersMessage.classList.remove('d-none');
        return;
    }
    
    noOrdersMessage.classList.add('d-none');
    
    orders.forEach(order => {
        const row = createOrderRow(order);
        ordersTableBody.appendChild(row);
    });
}
  function createOrderRow(order) {
        const row = document.createElement('tr');
        
        const statusClass = getStatusClass(order.status);
        const formattedDate = order.createdAt.toLocaleDateString() + ' ' + 
                             order.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const itemsPreview = order.items.slice(0, 2).map(item => {
        const title = item.title || 'Product';
        const size = item.size ? `(${item.size})` : '';
        const quantity = item.quantity || 1;
        return `<div class="order-item">${title} ${size} x${quantity}</div>`;
        }).join('');
    
        const moreItemsText = order.items.length > 2 ? 
          `<div class="order-item">+${order.items.length - 2} more items</div>` : '';
        
        row.innerHTML = `
          <td><code>${order.id}</code></td>
          <td>${order.firstName}</td>
          <td>${order.lastName}</td>
          <td>${order.email}</td>
          <td>${formattedDate}</td>
          <td>
            <div class="order-items">
              ${itemsPreview}
              ${moreItemsText}
            </div>
          </td>
          <td><strong>${order.totalAmount.toFixed(2)}</strong></td>
          <td><span class="order-status ${statusClass}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
        `;
        
        return row;
}

 
      function getStatusClass(status) {
        switch(status) {
          case 'pending': return 'status-pending';
          case 'completed': return 'status-completed';
          case 'cancelled': return 'status-cancelled';
          default: return 'status-pending';
        }
    }   
    
document.addEventListener('DOMContentLoaded', function() {
  
    if (refreshOrdersBtn) {
        refreshOrdersBtn.addEventListener('click', function() {
            loadOrdersSection();
        });
    }
  
    loadOrdersSection();
});


window.addEventListener('beforeunload', function() {
    currentLoadingOperation = null;
    isLoadingOrders = false;
});


document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && isLoadingOrders) {
  
        console.log('Page became visible, checking loading state...');
   
    }
});