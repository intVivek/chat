import './Home.scss';
import NavBar from '../../Components/NavBar/NavBar.js';
import {fetchHome} from '../../Services.js';
import {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {createRoom, fetchRoomData} from '../../Services.js';
import { toast } from 'react-toastify';
import {ReactComponent as Close} from '../../Assets/icons/close.svg';
import CreateModal from '../../Components/CreateModal/CreateModal';
import RoomBox from '../../Components/RoomBox/RoomBox';


const Home = ()=>{
  const [openModal, setOpenModal] = useState(false);
	const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(()=>{
    fetchHome()
    .then(res => {
      if(res?.status){
        console.log(res)
        res && setUserData(res.home);
      }
      else{
        navigate('/');
      }
    })
    .catch(err => {
        console.log(err)
    })
  },[]);

  const createHandler = (data)=>{
    createRoom(data)
    .then(res=>{
      if(res?.status){
        console.log(res)
        navigate(`/chat/${res.room}`);
      }
      else{
        toast.error("Error Creating Room");
      }
    })
  }

  return(
    <div className='homePage'>
      <NavBar img={userData.photos?userData.photos[0].value:""}/>
      {openModal && <CreateModal createHandler={createHandler} userData={userData} setOpenModal={setOpenModal} />}
      <div className={openModal?'body blur':'body'}>
        <div className='createRoom'>
          <div className='createBtn' onClick={()=>setOpenModal(true)}><p>Create</p> <Close className={openModal?'addIcon addIconSpin':'addIcon'}/></div>
          <div className='joinInput gradiantAnimation'><input className='inputField' placeholder='Enter a code or link'/></div>
          <div className='joinBtn'>Join</div>
        </div>
        <div className='ownRoom'>
          <div  className='ownRoomTitle'>
            Your Rooms
            <div className='border'></div>
          </div>
          <div className='ownRoomBody'>
            {
              userData.created && userData.created.map((room)=>{
                console.log('created',room)
                return <RoomBox
                  color={userData.color}
                  photo={userData.photos[0].value}
                  roomName={room.roomName}
                  invite={room.invite}
                  id={room._id}
                  name={userData.name.givenName}
                />
              })
            }
          </div>
          <div  className='ownRoomTitle'>
            Recently Joined
            <div className='border'></div>
          </div>
          <div className='ownRoomBody'>
            {
              userData.recentlyJoined && userData.recentlyJoined.map((room)=>{
                console.log('recentlyJoined' ,room);
                return <RoomBox
                    color={room.user.color}
                    photo={room.user.photos[0].value}
                    roomName={room.roomName}
                    invite={room.invite}
                    id={room._id}
                    name={room.user.name.givenName}
                  />
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;