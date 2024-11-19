import { BACKEND_URL } from "./config.js";

export async function getItems() {
  const items = await fetch(`${BACKEND_URL}/items`).then((r) => r.json());

  return items;
}

export async function createItem(item) {
  await fetch(`${BACKEND_URL}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
}

export async function deleteItem(id, item) {
  await fetch(`${BACKEND_URL}/items/${id}`, {
    method: "DELETE",
  });
}

export async function filterItems(filterName) {
  const queryParams = new URLSearchParams();

  // Only add filterName if it is not "-- ทั้งหมด --"
  if (filterName && filterName !== "") {
    queryParams.append("filterName", filterName);
  }

  const response = await fetch(
    `${BACKEND_URL}/items/filter?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const items = await response.json();
  return items;
}

export async function getMembers() {
  // TODO4: implement this function
  const members = await fetch(`${BACKEND_URL}/members`).then((r) => r.json());

  return members;
}

export async function createMember(member) {
  // TODO4: implement this function
  await fetch(`${BACKEND_URL}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(member),
  });
}

export async function deleteMember(id, member) {
  // TODO4: implement this function
  await fetch(`${BACKEND_URL}/members/${id}`, {
    method: "DELETE",
  });
}