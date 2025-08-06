// src/utils/localStorage.js
export function getCollection() {
  const data = localStorage.getItem("myCollection");
  return data ? JSON.parse(data) : [];
}
export function saveCollection(collection) {
  localStorage.setItem("myCollection", JSON.stringify(collection));
}
