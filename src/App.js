import { useState } from "react";
import "./style.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const FriendList = ({ friends, selectedFriend, setSelectedFriend }) => {
  return (
    <div className="friendsList">
      {friends.map((friend) => (
        <div>
          <Friend
            friend={friend}
            selectedFriend={selectedFriend}
            key={friend.id}
            setSelectedFriend={setSelectedFriend}
          />
        </div>
      ))}
    </div>
  );
};

const Friend = ({ friend, selectedFriend, setSelectedFriend }) => {
  const isSelected = friend.id === selectedFriend.id;
  function handleFriendSelection(friend) {
    setSelectedFriend((curr) => friend);
  }
  return (
    <div className={`${isSelected ? "selected" : ""} friend`}>
      <img src={friend.image} alt={friend.name} />
      <p>
        {friend.name}
        {friend.balance === 0 && <span>You and {friend.name} are even</span>}
        {friend.balance < 0 && (
          <span className="red">
            You owe {friend.name} {Math.abs(friend.balance)}$
          </span>
        )}
        {friend.balance > 0 && (
          <span className="green">
            {friend.name} owes you {friend.balance}$
          </span>
        )}
      </p>
      <Button onClick={() => handleFriendSelection(friend)}>
        {isSelected ? "close" : "select"}
      </Button>
    </div>
  );
};

const AddFriend = ({ setFriends }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  const [addFriend, setAddFriend] = useState(false);

  function handleShowHideAddFriend() {
    setAddFriend((s) => !s);
  }

  function handleAddFriends(e) {
    e.preventDefault();
    if (name.length === 0) return;

    const newFriend = { id: Date.now(), name: name, image: image, balance: 0 };

    setFriends((friend) => [...friend, newFriend]);
    setName("");
    setImage("https://i.pravatar.cc/48");
    setAddFriend(false);
  }

  return (
    <div className="add-friend">
      {addFriend && (
        <form onSubmit={handleAddFriends}>
          <span>
            <label>🧑‍🤝‍🧑 Friend Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </span>
          <span>
            <label>🖼️ Image URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </span>
          <Button styleClass={"add-button"}>ADD</Button>
        </form>
      )}
      <Button onClick={handleShowHideAddFriend}>
        {addFriend ? "Close" : "Add Friend"}
      </Button>
    </div>
  );
};

const SplitBill = ({ setFriends, selectedFriend }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  let paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  function handleSumbit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    const value = whoIsPaying === "user" ? paidByFriend : -paidByUser;

    setFriends(friends => friends.map(friend =>
      friend.id === selectedFriend.id ? { ...friend, balance: friend.balance + value } : friend))

    setBill("")
    setPaidByUser("")
    paidByFriend = ""
    setWhoIsPaying("user")

  }

  return (
    <div className="split-bill">
      <form onSubmit={handleSumbit}>
        <h3>SPLIT A BILL WITH {selectedFriend.name}</h3>
        <span>
          <label>💰 Bill Value</label>
          <input
            type="text"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
          />
        </span>
        <span>
          <label>👧 Your Expanse</label>
          <input
            type="text"
            value={paidByUser}
            onChange={(e) => setPaidByUser(
              Number(e.target.value) > bill ?
                paidByUser : Number(e.target.value)
            )}
          />
        </span>
        <span>
          <label>🧑‍🤝‍🧑 {selectedFriend.name} Expanse</label>
          <input type="text" disabled value={paidByFriend} />
        </span>
        <span>
          <label>Who is paying the bill?</label>
          <select
            value={whoIsPaying}
            onChange={(e) => setWhoIsPaying(e.target.value)}>
            <option value="user">You</option>
            <option value="friend">{selectedFriend.name}</option>
          </select>
        </span>
        <Button styleClass={"add-button"}>Split Bill</Button>
      </form>
    </div>
  );
};

const Button = ({ styleClass, onClick, children }) => {
  return (
    <button className={`${styleClass} button`} onClick={onClick}>
      {children}
    </button>
  );
};

function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(initialFriends[0]);

  console.log(selectedFriend);
  return (
    <div className="container">
      <FriendList
        friends={friends}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}
      />
      {<SplitBill setFriends={setFriends} selectedFriend={selectedFriend} />}
      <AddFriend setFriends={setFriends} />
    </div>
  );
}

export default App;
