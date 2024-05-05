import React, { useContext, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from '../context/AuthContext';


const Search = () => {
    const [username, setUsername] = useState("");
    const [user, setUser] = useState(null);
    const [err, setErr] = useState(false);

    const { currentUser } = useContext(AuthContext);

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", "==", username)
        );

        try {
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setUser(doc.data())
            });
        } catch (err) {
            setErr(true);
        }
    };

    const handleKey = (e) => {
        e.code == "Enter" && handleSearch();
    }

    // const handleSelect = async () => {

    //     //check whether the group(chats in firestore) exists, if not create
    //     const combinedId = currentUser.uid > user.uid
    //         ? currentUser.uid + user.uid
    //         : user.uid + currentUser.uid;
    //     try {
    //         const res = await getDoc(doc(db, "chats", combinedId));

    //         if (!res.exists()) {
    //             //create a chat in chats collection
    //             await setDoc(doc(db, "chats", combinedId), {
    //                 messages: []
    //             });

    //             console.log("Chat created in chats collection");
    //         }
    //         //create user chats
    //         await updateDoc(doc(db, "userChats", currentUser.uid), {
    //             [combinedId + ".userInfo"]: {
    //                 uid: user.uid,
    //                 displayName: user.displayName,
    //                 photoURL: user.photoURL
    //             },
    //             [combinedId + ".date"]: serverTimestamp()
    //         });

    //         await updateDoc(doc(db, "userChats", user.uid), {
    //             [combinedId + ".userInfo"]: {
    //                 uid: currentUser.uid,
    //                 displayName: currentUser.displayName,
    //                 photoURL: currentUser.photoURL
    //             },
    //             [combinedId + ".date"]: serverTimestamp()
    //         });

    //     } catch (err) { }

    //     setUser(null);
    //     setUsername("");
    // }

    const handleSelect = async () => {
        const combinedId = currentUser.uid > user.uid
            ? currentUser.uid + user.uid
            : user.uid + currentUser.uid;

        try {
            // Check if the "chats" document exists, if not, create it
            const res = await getDoc(doc(db, "chats", combinedId));
            if (!res.exists()) {
                await setDoc(doc(db, "chats", combinedId), {
                    messages: []
                });
                console.log("Chat created in chats collection");
            }

            // Fetch the existing "userChats" documents for both users
            const userChatRef1 = doc(db, "userChats", currentUser.uid);
            const userChatDoc1 = await getDoc(userChatRef1);
            const userChatRef2 = doc(db, "userChats", user.uid);
            const userChatDoc2 = await getDoc(userChatRef2);

            // Check if the "userChats" documents exist, if not, create them
            if (!userChatDoc1.exists()) {
                await setDoc(userChatRef1, {});
            }
            if (!userChatDoc2.exists()) {
                await setDoc(userChatRef2, {});
            }

            // Update the "userChats" documents with the new "combinedId" data
            await updateDoc(userChatRef1, {
                [combinedId + ".userInfo"]: {
                    uid: user.uid,
                    displayName: user.displayName,
                    photoURL: user.photoURL
                },
                [combinedId + ".date"]: serverTimestamp()
            });

            await updateDoc(userChatRef2, {
                [combinedId + ".userInfo"]: {
                    uid: currentUser.uid,
                    displayName: currentUser.displayName,
                    photoURL: currentUser.photoURL
                },
                [combinedId + ".date"]: serverTimestamp()
            });

        } catch (err) {
            console.error(err);
        }

        setUser(null);
        setUsername("");
    };

    return (
        <div className='search'>
            <div className="searchForm">
                <input type="text" placeholder='Find a user' onKeyDown={handleKey}
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                />
            </div>
            {err && <span>User not found *-*</span>}
            {user && (<div className="userChat" onClick={handleSelect}>
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                    <span>{user.displayName}</span>
                </div>
            </div>)}
        </div>
    );
}

export default Search

