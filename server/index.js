import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌾 CropCare AI Backend running on http://localhost:${PORT}`);
  console.log(`📁 Local storage directory: uploads/`);
  console.log(`🗄️ SQLite database: data/cropcare.db`);
});
