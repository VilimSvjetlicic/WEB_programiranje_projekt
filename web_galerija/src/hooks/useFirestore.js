import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { onSnapshot, doc, updateDoc, setDoc, Timestamp, collection, query, where, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useUserAuth } from '../context/UserAuthContext';

const useFirestore = (col, docID) => {
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [searchItems, setSearchItems] = useState([]);
    const { user } = useUserAuth();
    let date = Timestamp.now();


    const deletePost = async (result) => {
        const document = doc(firestore, col, docID);
        try {
            await updateDoc(document, {
                posts: result,
            })
        } catch (error) {
            console.log(error);
        }
    }

    const createGroup = async (groupName) => {
        const groupDoc = doc(firestore, 'groups', date + "_" + user.email);
        try {
            await setDoc(groupDoc, {
                groupName: groupName,
                users: [user.email],
                posts: [],
            });
        } catch (error) {
            console.log(error);
        }
    }

    const joinGroup = async (groupID) => {
        const groupDoc = doc(firestore, 'groups', groupID);
        try{
            await updateDoc(groupDoc, {
                users: arrayUnion (user.email)
            })
            console.log(groupID + " is joined")
        } catch(error){
            console.log(error);
        }
    }

    const leaveGroup = async () => {
        console.log("firebase called")
        const groupDoc = doc(firestore, 'groups', docID);
        try{
            await updateDoc(groupDoc, {
                users: arrayRemove (user.email)
            })
            console.log(docID + " is left")
        } catch(error){
            console.log(error);
        }
    }

    const getUsersGroups = () => {
        const groupsDoc = collection(firestore, "groups");
        onSnapshot(groupsDoc, async () => {
            const getUsersGroupsQuery = query(collection(firestore, "groups"), where('users', 'array-contains', `${user.email}`));
            const querySnapshot = await getDocs(getUsersGroupsQuery);
            let usersGroups = [];
            querySnapshot.forEach((doc) => {
                usersGroups.push({ ...doc.data(), groupName: doc.data().groupName, id: doc.id });
            });
            setGroups(usersGroups);
        })
    }

    const searchGroups = async (groupName) => {
        const searchGroupsQuery = query(collection(firestore, "groups"), where('groupName', '==', `${groupName}`));
        const querySnapshot = await getDocs(searchGroupsQuery);
        let searchGroups = [];
        querySnapshot.forEach((doc) => {
            if(doc.data().users.includes(user.email)){
                console.log("u are in");
                return;
            }
            searchGroups.push({ ...doc.data(), groupName: doc.data().groupName, id: doc.id });
        });
        setSearchItems(searchGroups);
    }

    useEffect(() => {
        try{
            const document = doc(firestore, col, docID);
            onSnapshot(document, (doc) => {
                setPosts(doc.data().posts);
            })
        } catch (error){
            console.log(error);
        }

        getUsersGroups();
        searchGroups();
    }, [user])

    return { posts, groups, deletePost, createGroup, searchGroups, searchItems, joinGroup, leaveGroup };
}

export default useFirestore;