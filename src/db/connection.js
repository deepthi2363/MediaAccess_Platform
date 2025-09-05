import mysql from "mysql2/promise";
import { DB_CONFIG } from "../config.js";

export const db = await mysql.createPool(DB_CONFIG);
