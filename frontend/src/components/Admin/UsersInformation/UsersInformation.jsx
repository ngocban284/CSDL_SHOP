import { createRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../../createInstance";
import { getAllUserFromAPI } from "../../../redux/apiRequest";
import { useState } from "react";
import './UsersInformation.scss'

const UsersInformation = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const axiosJWT = createAxios(user, dispatch);
    const allUsers = useSelector((state) => state.user.users.allUsers);
    const [status, setStatus] = useState(1);
    let ptrArr = [].concat(allUsers);
    const setPtrArr = (ptr) => {
        ptrArr = [...ptr];
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    const changeStatus = (choose) => {
        switch (parseInt(choose)) {
            case 1:
                setPtrArr([...allUsers].sort((a, b) => a.user_id > b.user_id ? 1 : -1));
                console.log(ptrArr);
                break;
            case 2:
                setPtrArr([...allUsers].sort((a, b) => a.userTotal > b.userTotal ? 1 : -1))
                console.log(ptrArr);
                break;
            case 3:
                setPtrArr([...allUsers].sort((a, b) => a.userTotal < b.userTotal ? 1 : -1))
                console.log(ptrArr);
                break;
            case 4:
                setPtrArr([...allUsers].filter((a) => {
                    let ptr_string = a.birthday.substring(3, 5);
                    let curr = new Date()
                    console.log(parseInt(ptr_string))
                    if (parseInt(ptr_string) == curr.getMonth() + 1) return a;
                }))
                console.log(ptrArr);
                break;
            default:
                break;
        }
    }
    allUsers && changeStatus(status);
    useEffect(() => {
        const callAPI = async () => {
            if (!user || user.user.user_id !== 1) {
                navigate("/login");
            } else {
                await getAllUserFromAPI(dispatch, user.token, axiosJWT);
            }
        }
        callAPI();
        console.log("allUsers", allUsers);
    }, []);
    return (
        <div className="container">
            <div className="content-page noi">
                <h1 className="userInfo_heading">Danh s??ch ng?????i d??ng</h1>
                <div className="table-responsive users-table-responsive">
                    <div className="order-sort">
                        <select className="sortBar" onChange={e => setStatus(e.target.value)}>
                            <option value="1">S???p x???p theo ID t??ng d???n</option>
                            <option value="2">S???p x???p chi ti??u t??ng d???n</option>
                            <option value="3">S???p x???p chi ti??u gi???m d???n</option>
                            <option value="4">Ng?????i sinh nh???t trong th??ng n??y</option>
                        </select>
                    </div>
                    <table className="table users-table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">H??? v?? t??n</th>
                                <th scope="col">Gi???i t??nh</th>
                                <th scope="col">Ng??y sinh</th>
                                <th scope="col">?????a ch???</th>
                                <th scope="col">Email</th>
                                <th scope="col">Chi ti??u</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                ptrArr && ptrArr.map((user, index) => {
                                    return (
                                        <tr>
                                            <td>{user?.user_id}</td>
                                            <td>
                                                {user?.user_name}
                                            </td>
                                            <td>{user?.gender}</td>
                                            <td>{user?.birthday}</td>
                                            <td>{user?.address ? user.address : ""}</td>
                                            <td>{user?.email}</td>
                                            <td>{Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(user?.userTotal)}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UsersInformation;