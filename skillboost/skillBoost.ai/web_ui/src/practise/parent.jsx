// import React, { useEffect, useMemo, useState } from "react";
// import UsersList from "./child";
// import debounce from 'lodash.debounce';
// // import { FixedSizeList as List } from "react-window";

// // const items = Array.from({ length: 1000 }, (_, index) => `${index + 1}`);

// // export default function VirtualizedList() {
// //   return (
// //     <div style={{ padding: "20px" }}>
// //       <h2>Virtualized List (react-window)</h2>
// //       <List height={300} itemCount={items.length} itemSize={35} width={"100%"}>
// //         {({ index, style }) => <div style={style}>{items[index]}</div>}
// //       </List>
// //     </div>
// //   );
// // }


// export default function List() {
//   const [list, setUser] = useState([]);
//   const [selectedPostId, setSelectedPostId] = useState(null);
//   const[searchValue,setSearchValue] = useState("");

//   useEffect(() => {
//     const usersData = async () => {
//       try {
//         const data = await fetch("https://jsonplaceholder.typicode.com/albums/1/photos");
//         const res = await data.json();
//         setUser(res.slice(0, 10));
//         console.log(res)
//       } catch (err) {
//         console.log(err.message);
//       }
//     };
//     usersData();
//   }, []);

//   const handleToggle = (id) => {
//     setSelectedPostId(selectedPostId === id ? null: id)
//   };

//  const filteredList = list.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()));
//  const debounced = debounce(() => {
//   filteredList
//  },500)
//   return (
//     <div>
//       <input
//         type="search"
//         onChange={(e) => { setSearchValue(e.target.value); debounced(e.target.value)}}
//         value={searchValue}
//       />
//       <h3>Filtered Results:</h3>
//       {filteredList.length === 0 && <p>no users found</p>}
//       {filteredList.map((item) => (
//         <UsersList
//           key={item.id}
//           user={item}
//           isOpen={selectedPostId === item.id}
//           onUserList={() => handleToggle(item.id)}
//         />
//       ))}
//     </div>
//   );
// }

