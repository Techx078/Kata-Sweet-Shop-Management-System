
  function purchaseSweet(id, availableQty) {
    const qty = prompt('Enter quantity to purchase:');
    if (!qty) return;
    if (parseInt(qty) > availableQty) {
      alert("Not enough stock. Available quantity: " + availableQty);
      return;
    }
    fetch(`/purchase/${id}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `quantity=${encodeURIComponent(qty)}`
    }).then(() => {
      showToast('Purchased successfully!');
      setTimeout(() => window.location.reload(), 1000);
    });
  }
  function deleteSweet(id) {
      const password = prompt('Enter delete password:');
      if( password != "delete123" ) {
        alert("Invalid password");
        return;
      }
      if (confirm('Are you sure you want to delete this sweet?')) {
        fetch('/delete/${id}', { 
          method: 'POST' ,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'password=${encodeURIComponent(password)}'
        })
          .then(() => window.location.reload());
      }
    }
  function restockSweet(id) {
      const qty = prompt('Enter quantity to restock:');
      const password = prompt('Enter restock password:');
      if( password != "restock123" ) {
        alert("Invalid password");
        return;
      }
      if (qty && password) {
        fetch('/restock/${id}', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: quantity='${encodeURIComponent(qty)}&password=${encodeURIComponent(password)}'
        }).then(() => window.location.reload());
      }
    }

  function showToast(message) {
    const toastEl = document.getElementById('actionToast');
    toastEl.querySelector('.toast-body').textContent = message;
    new bootstrap.Toast(toastEl).show();
  }
