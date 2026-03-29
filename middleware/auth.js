import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // 1. Lấy token từ header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy Token! Vui lòng đăng nhập.' });
  }

  // 2. Xác thực token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Phiên đăng nhập hết hạn hoặc Token không hợp lệ!' });
    }

    /* LƯU Ý QUAN TRỌNG: 
       Trong Controller mình dùng "req.user.id", nên ở đây mình gán 
       toàn bộ decoded vào "req.user" để đồng bộ nhé.
    */
    req.user = decoded; 
    
    // Nếu bạn muốn dùng req.userId cho giống code cũ cũng được, 
    // nhưng dùng req.user sẽ linh hoạt hơn nếu sau này token có thêm email, role...
    req.userId = decoded.id; 

    next();
  });
};