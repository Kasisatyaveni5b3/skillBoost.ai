// import User from '../userModel.js';


// export const signUp = async (req, res) => {
//   console.log('Signup API hit');
//   const { name, email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     const newUser = new User({ name, email, password });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully', user: newUser });
//   } catch (err) {
//     console.error("Signup error ❌", err.message); // ✅ Corrected
//     res.status(500).json({ error: "Something went wrong" });
//   }
// };


// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || user.password !== password)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     res.status(200).json({ message: 'Login successful', user });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
