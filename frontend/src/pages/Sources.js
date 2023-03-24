import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom"
import { transform } from "typescript";
import axios from "../api/axios";



const Sources = ({data}) => {

    const navigate = useNavigate()

    // store these in local browser to remember after refresh
    const [selected, setSelected] = useState('users')
    const [friends, setFriends] = useState('all')

    // these are loaded immediately on login / refresh
    const [loadFriends, setLoadFriends] = useState([])
    const [loadPending, setLoadPending] = useState([])
    const [loadSaved, setLoadSaved] = useState([])

    // these are loaded after submitting a search query
    const [loadUsers, setLoadUsers] = useState([])
    const [loadFolders, setLoadFolders] = useState([])

    const [search, setSearch] = useState('')

    // -------------- For search --------------

    const [query, setQuery] = useState({
        search: search,         // refers to what is being search
        selected: selected,     // refers to the applied filter (e.g. users, folders, saved, friends)
        id : data.id            // the person doing the searching
    })

    const [friendReq, setFriendReq] = useState({
        state: '',              // refers to either 'sending', 'accepting', 'denying'
        user: loadUsers.id,     // the users recieving the friend request
        id: data.id             // the user sending the friend request
    })

    // -------- call init getters here ---------- 
    useEffect(() => {
        if(!data.isLoggedIn) {
            data.currentPoint = 'login'
            navigate('/login')
        }

        getFriends()
      }, [])


    /* 
    * NOTE: generally speaking, the only things i need from backend 
    * is a list of objects containing with attributes 'username', 
    * 'firstName', and 'lastName' in order to render them. 
    */

    const getFriends = async () => {
        const res = await axios.get(`/friends/?user_id=${data.id}`)
        console.log("res = ")
        console.log(res.data)

        // ----------- this part it probably done in backend (will delete later) ------------

        let gatheringFriends = []

        for (let i = 0; i < res.data.length; i++) {
            let tempObject = await axios.get(`/users/?id=${res.data[i].friend_id}`) 
            let friendObject = {
                user : '',
                firstName : '',
                lastName : ''
            }

            friendObject.user = tempObject.data[0].user
            friendObject.firstName = tempObject.data[0].firstName
            friendObject.lastName = tempObject.data[0].lastName
            gatheringFriends.push(friendObject)
        }
        // ----------- end of backend part ------------

        setLoadFriends(gatheringFriends)
    }

    //   get users with given username, first, or last name
    const handleUserSearch =()=> {
    }

    //   search through and get all of logged in users friends and pending requests
    const handleSearchFriend =()=> {
    
    }

    const handleGetFriends =()=> {

    }

    const handleGetPending =()=> {

    }

    //   get all of users saved items
    const handleGetItems =()=> {

    }

    const handleSearchItems =()=> {

    }

    //   send a friend request 
    const handlePostRequest =()=> {

    }

    // return loading message here. swap to bottom render once data is loaded in.

    return ( 
        <div className="sources">

                <div className="sub-navbar">

                    <div></div>

                    <div style={{width: '800px'}}>
                        <div id="search_form" >
                            <button id="search_button">
                                <svg id="search_icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                </svg>
                            </button>

                            <input type="text" name="searchbar" placeholder='Search' id="search_bar" value={search} onChange={(e) => setSearch(e.target.value)}/>
                        </div>

                        <div className="selection">

                            <div className={selected === 'users' ? "selected" : "selection-content"} onClick={() => setSelected('users')}>
                                Users
                            </div> 

                            <div className={selected === 'folders' ? "selected" : "selection-content"} onClick={() => setSelected('folders')}>
                                Folders
                            </div> 

                            <div className={selected === 'saved' ? "selected" : "selection-content"} onClick={() => setSelected('saved')}>
                                Saved
                            </div> 

                            <div className={selected === 'friends' ? "selected" : "selection-content"} onClick={() => setSelected('friends')}>
                                Friends
                            </div> 

                        </div>

                            {/* 
                                display another sub-nav depending on the 
                                top selection state
                            */}

                            {selected === 'friends' ? 
                                <div className="selection nested">
                                <div className={friends === 'all' ? "nested-selected" : "nested-content"} onClick={() => setFriends('all')}>
                                    All
                                </div> 
    
                                <div className={friends === 'pending' ? "nested-selected" : "nested-content"} onClick={() => setFriends('pending')}>
                                    Pending
                                </div> 
                            </div> :

                                <div></div>
                            }

                        
                    </div>

                    <div></div>

                </div>

                {/* 
                    render results here upon form submission.
                    results will be its own stack of returned
                    content from backend / database

                    divide results based on current selection.
                 */}

                 <div className="sources-results">
                    {selected === 'friends' && friends === "all" &&
                        loadFriends.map((loadData) => (
                            <div className="box">

                                <div className="user-grid">
                                    <div className="box-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                        </svg>
                                    </div>

                                    <div className="box-username"> @{loadData.user} <br /> {loadData.firstName} {loadData.lastName} </div>
                                </div>
                                
                                <div className="box-star">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
                                    </svg>
                                </div>


                                <div className="box-friend">
                                    Add friend
                                </div>

                            </div>
                        ))
                    }
        
                 </div>
        </div>
     );
}
 
export default Sources;