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
          <td><img src="${menuItem.imagePath}" alt="${
        menuItem.name
      }" /></td> <!-- Display image -->
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

    const formData = new FormData(menuForm); // Create FormData object to handle file upload

    const menuId = document.getElementById("menuId").value;
    if (menuId) {
      // Update existing menu item
      await fetch(`http://localhost:5000/api/menuItems/${menuId}`, {
        method: "PUT",
        body: formData, // Send form data with image
      });
    } else {
      // Create new menu item
      await fetch("http://localhost:5000/api/menuItems", {
        method: "POST",
        body: formData, // Send form data with image
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
