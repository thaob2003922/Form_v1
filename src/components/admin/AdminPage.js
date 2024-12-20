import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import DeleteIcon from '@mui/icons-material/Delete';  // Thêm biểu tượng Delete từ Material UI
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';  // Thêm các thành phần để hiển thị hộp thoại cảnh báo
import "./AdminPage.css";

const AdminPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);  // Trạng thái hiển thị hộp thoại cảnh báo
    const [userToDelete, setUserToDelete] = useState(null);  // Lưu user được chọn để xóa
    const [userCount, setUserCount] = useState(0);  // Trạng thái để lưu số lượng người dùng
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.role === 'admin') {
                setIsAdmin(true);
                fetchUsers(token);  // Gọi API để lấy danh sách người dùng
            } else {
                navigate('/statics');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchUsers = async (token) => {
        try {
            const response = await axios.get('http://localhost:8000/api/users/all', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUsers(response.data);  // Lưu danh sách người dùng vào state
            setUserCount(response.data.length);  // Cập nhật số lượng người dùng
            setLoading(false);  // Đặt loading = false sau khi lấy dữ liệu
        } catch (err) {
            console.error('Error fetching users:', err);
            setLoading(false);
        }
    };

    // Xử lý xóa tài khoản
    const handleDelete = async (id, token) => {
        try {
            await axios.delete(`http://localhost:8000/api/users/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setUsers(users.filter(user => user._id !== id));  // Loại bỏ người dùng đã xóa khỏi danh sách
            setUserCount(userCount - 1);
            alert("Tài khoản người dùng đã được xóa thành công");
            setOpenDialog(false);  // Đóng hộp thoại
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    // Mở hộp thoại cảnh báo
    const openDeleteDialog = (user) => {
        setUserToDelete(user);  // Lưu người dùng cần xóa
        setOpenDialog(true);  // Hiển thị hộp thoại
    };

    // Đóng hộp thoại cảnh báo
    const closeDeleteDialog = () => {
        setOpenDialog(false);
        setUserToDelete(null);
    };

    // Hàm quay về trang chủ
    const goToHomePage = () => {
        navigate('/');  // Điều hướng về trang chủ
    };

    return (
        <>
            <div className="admin-container">
                {isAdmin ? (
                    <div  className="admin-content">

                        <h1 className="admin-header">Xin chào Admin!</h1>

                        {/* Hiển thị thông tin số lượng người dùng */}
                        <div className="user-statistics">
                            <h3>Tổng người dùng: {userCount}</h3>
                        </div>

                        {loading ? (
                            <p>Loading users...</p>
                        ) : (
                            <div className='table-all-users'>
                                <h2>Bảng danh sách tất cả người dùng</h2>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>#</th> {/* Cột STT */}
                                            <th>Username</th>
                                            <th>Email</th>
                                            <th>Vai trò</th>
                                            <th>Hành động</th> {/* Cột Actions */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={user._id}>
                                                    <td>{index + 1}</td> {/* Tính STT bắt đầu từ 1 */}
                                                    <td>{user.username}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>
                                                        <Button onClick={() => openDeleteDialog(user)} color="secondary">
                                                            <DeleteIcon />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5">No users found</td> {/* Cập nhật colSpan cho 5 cột */}
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>Từ chối truy cập</div>
                )}

                {/* Hộp thoại cảnh báo xóa tài khoản */}
                <Dialog
                    open={openDialog}
                    onClose={closeDeleteDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Delete User?"}</DialogTitle>
                    <DialogContent>
                        <p>Bạn có chắc chắn muốn xóa tài khoản của "{userToDelete?.username}"?</p>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDeleteDialog} color="primary">
                            Hủy
                        </Button>
                        <Button
                            onClick={() => handleDelete(userToDelete._id, localStorage.getItem('token'))}
                            color="secondary"
                            autoFocus
                        >
                            Xóa
                        </Button>
                    </DialogActions>
                </Dialog>
                <div className='btn-home'>
                    <Button
                        variant="outlined"
                        color="primary"
                        onClick={goToHomePage}
                        style={{ marginBottom: '20px' }}
                    >
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </>
    );
};

export default AdminPage;
