"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/", (req, res) => res.send("API is running..."));
const users = require('./routes/users.js');
const auth = require('./routes/auth.js');
const musicbrainz = require('./routes/musicbrainz.js');
const reviews = require('./routes/reviews.js');
const stats = require('./routes/stats.js');
const health = require('./routes/healthcheck.js');
app.use('/api/musicbrainz', musicbrainz);
app.use('/api/auth', auth);
app.use('/api/reviews', reviews);
app.use('/api/users', users);
app.use('/api/stats', stats);
app.use('/api/health', health);
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
