function UsersList({ user, onUserList,isOpen }) {
  return (
    <div>
      <h3 onClick={onUserList} style={{ cursor: "pointer", color: "blue" }}>
        {user.title}
      </h3>
      {isOpen && <img src={"https://picsum.photos/200/300"} alt={user.title} style={{ width: "150px", marginTop: "10px" }}/>}
    </div>
  );
}
export default UsersList