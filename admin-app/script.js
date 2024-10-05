document.addEventListener("DOMContentLoaded", () => {
  const menuForm = document.getElementById("menuForm");
  const menuTableBody = document.querySelector("#menuTable tbody");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");

  // Fetch all menu items and display them
  async function fetchMenuItems() {
    const response = await fetch("http://localhost:5000/api/menuItems");
    const menuItems = await response.json();
    displayMenuItems(menuItems);
  }

  function displayMenuItems(menuItems) {
    menuTableBody.innerHTML = "";
    menuItems.forEach((menuItem) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${menuItem.name}</td>
          <td>${menuItem.category}</td>
          <td>${menuItem.price}</td>
          <td>${menuItem.size || "-"}</td>
          <td>
            <button class="edit-btn" data-id="${menuItem._id}">Edit</button>
            <button class="delete-btn" data-id="${menuItem._id}">Delete</button>
          </td>
        `;
      menuTableBody.appendChild(row);
    });
  }

  // Handle form submission for creating/updating
  menuForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const menuItem = {
      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      price: document.getElementById("price").value,
      size: document.getElementById("size").value,
    };

    const menuId = document.getElementById("menuId").value;
    console.log(menuId);
    if (menuId) {
      // Update existing menu item
      await fetch(`http://localhost:5000/api/menuItems/${menuId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItem),
      });
    } else {
      // Create new menu item
      await fetch("http://localhost:5000/api/menuItems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menuItem),
      });
    }
    menuForm.reset();
    fetchMenuItems();
  });

  // Edit or Delete menu item
  menuTableBody.addEventListener("click", async (e) => {
    const target = e.target;

    if (target.classList.contains("edit-btn")) {
      const menuId = target.dataset.id;
      const response = await fetch(
        `http://localhost:5000/api/menuItems/${menuId}`
      );
      const menuItem = await response.json();

      // Populate form for editing
      document.getElementById("menuId").value = menuItem._id;
      document.getElementById("name").value = menuItem.name;
      document.getElementById("category").value = menuItem.category;
      document.getElementById("price").value = menuItem.price;
      document.getElementById("size").value = menuItem.size;
      formTitle.textContent = "Edit Menu Item";
      submitBtn.textContent = "Update Item";
    } else if (target.classList.contains("delete-btn")) {
      const menuId = target.dataset.id;
      await fetch(`http://localhost:5000/api/menuItems/${menuId}`, {
        method: "DELETE",
      });
      fetchMenuItems();
    }
  });

  // Fetch menu items on page load
  fetchMenuItems();
});
