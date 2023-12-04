import { useState } from 'react';

const initialFriends = [
	{
		id: 118836,
		name: 'Clark',
		image: 'https://i.pravatar.cc/48?u=118836',
		balance: -7,
	},
	{
		id: 933372,
		name: 'Sarah',
		image: 'https://i.pravatar.cc/48?u=933372',
		balance: 20,
	},
	{
		id: 499476,
		name: 'Anthony',
		image: 'https://i.pravatar.cc/48?u=499476',
		balance: 0,
	},
];

export default function App() {
	const [friends, setFriends] = useState(initialFriends);
	const [showFormAddFriend, setShowFormAddFriend] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState(null);

	console.log('Friends : ', friends);
	function ToggleShowAddFriend() {
		setShowFormAddFriend((show) => !show);
	}

	function HandleNewFriend(newFriend) {
		setFriends((friends) => [...friends, newFriend]);
		setShowFormAddFriend(false);
	}

	function HandleSelectedFriend(friend) {
		// console.log('... in handleSelectedFriend...');
		setSelectedFriend(friend);
		setShowFormAddFriend(false);
	}

	function HandleCloseFriend() {
		setSelectedFriend(null);
		setShowFormAddFriend(false);
	}

	function HandleBalanceUpdate(balanceChange) {
		console.log('in HandleBalanceUpdate, balanceChange ; ', balanceChange);
		setFriends((friends) =>
			friends.map((friend) =>
				friend.id === selectedFriend.id ? { ...friend, balance: balanceChange } : friend
			)
		);
		setSelectedFriend(null);

		console.log('Final friends, selectedFriend : ', friends, selectedFriend);
	}

	return (
		<div className='app'>
			<div className='sidebar'>
				<FriendsList
					friends={friends}
					selectedFriend={selectedFriend}
					onSelectFriend={HandleSelectedFriend}
					onCloseFriend={HandleCloseFriend}
				/>
				{showFormAddFriend && <FormAddFriend onAddFriend={HandleNewFriend} />}

				<Button
					className={'button'}
					onAction={() => ToggleShowAddFriend()}>
					{showFormAddFriend ? 'Close' : 'Add a Friend'}
				</Button>
			</div>
			<div>
				{selectedFriend && (
					<FormSplitBill
						friend={selectedFriend}
						onBalanceChange={HandleBalanceUpdate}
					/>
				)}
			</div>
		</div>
	);
}
function FriendsList({ friends, selectedFriend, onSelectFriend, onCloseFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					key={friend.id}
					friend={friend}
					selectedFriend={selectedFriend}
					onSelectFriend={onSelectFriend}
					onCloseFriend={onCloseFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, selectedFriend, onSelectFriend, onCloseFriend }) {
	const isSelected = friend?.id === selectedFriend?.id || null;

	return (
		<li className={isSelected ? 'selected' : ''}>
			<img
				src={friend.image}
				alt={friend.name}></img>
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className='red'>
					You owe {friend.name} ${Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance > 0 && (
				<p className='green'>
					{friend.name} owes you ${friend.balance}
				</p>
			)}
			{friend.balance === 0 && <p className=''>You and your Friend {friend.name} are even!</p>}
			<Button
				className='button'
				onAction={() => (!isSelected ? onSelectFriend(friend) : onCloseFriend())}>
				{isSelected ? 'Close' : 'Select'}
			</Button>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState('');
	const [image, setImage] = useState('https://i.pravatar.cc/48');

	/**
	 * Submits the form, creates a new friend, and resets the form fields.
	 * @param {object} event - The event object from the form submission.
	 */
	const handleSubmit = (event) => {
		event.preventDefault();
		if (!name) return;

		const id = crypto.randomUUID();

		const newFriend = { name: name, image: `${image}?=${id}`, id: id, balance: 0 };
		/**
		 * Lifting up state to App.js through function passed by App.js
		 */
		onAddFriend(newFriend);

		// Reset Fields (states) values
		setName('');
		setImage('https://i.pravatar.cc/48');
	};

	return (
		<form
			className='form-add-friend'
			onSubmit={handleSubmit}>
			<label>Friend Name: </label>
			<input
				type='text'
				placeholder="Enter Friend's name"
				value={name}
				onChange={(e) => setName(e.target.value)}></input>

			<label>Image URL: </label>
			<input
				type='text'
				placeholder="Enter Friend's Image URL"
				value={image}
				onChange={(e) => setImage(e.target.value)}></input>
			<Button className='button'>Add</Button>
		</form>
	);
}

function FormSplitBill({ friend, onBalanceChange }) {
	const [bill, setBill] = useState(0);
	const [yourShare, setYourShare] = useState(0);
	let friendShare = bill - yourShare;
	const [billPayer, setBillPayer] = useState('you');
	let balanceChange = 0;

	function handleWhoPays(e) {
		e.preventDefault();
		console.log('bill : ', bill);
		console.log('billPayer : ', billPayer);
		console.log('yourShare : ', yourShare);
		console.log('friendShare : ', friendShare);
		if (!bill || !yourShare) return;
		console.log('billPayer = ', billPayer);
		if (billPayer === 'you') {
			balanceChange = friend.balance + friendShare;
		} else if (billPayer === 'friend') {
			balanceChange = friend.balance - yourShare;
		}
		console.log('balanceChange in FormSplitBill = ', balanceChange);

		onBalanceChange(balanceChange);

		setBill(0);
		setBillPayer('you');
		setYourShare(0);
		friendShare = 0;
	}
	// console.log('just before line 194, updatedFriend : ', updatedFriend);

	return (
		<form
			className='form-split-bill'
			onSubmit={handleWhoPays}>
			<h2>Split a bill with {friend.name}</h2>
			<label>Bill Value : </label>
			<input
				type='text'
				placeholder={bill}
				// value={bill}
				onChange={(e) => setBill(parseFloat(e.target.value))}></input>
			<label>Your share : </label>
			<input
				type='text'
				placeholder='Enter your share'
				// value={yourShare}
				onChange={(e) => setYourShare(parseFloat(e.target.value) || 0)}></input>
			<label>{friend.name}'s share : </label>
			<input
				type='text'
				value={friendShare}
				disabled></input>
			<label>Who is paying the entire bill? </label>
			<select onChange={(e) => setBillPayer(e.target.value)}>
				<option value='you'>you</option>
				<option value='friend'>{friend.name}</option>
			</select>
			<Button className='button'>Split Bill</Button>
		</form>
	);
}

function Button({ className, onAction, children }) {
	return (
		<button
			className={className ? className : ''}
			onClick={onAction}>
			{children}
		</button>
	);
	// Same as...
	//return <button className={className || ""}>{children}</button>;
}
