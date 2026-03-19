"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mssqlquery6 = void 0;
const sql = __importStar(require("mssql"));
let pool = null;
function getPool() {
    return __awaiter(this, void 0, void 0, function* () {
        if (pool && pool.connected)
            return pool;
        pool = yield sql.connect({
            user: process.env.MSSQL6_USER || '',
            password: process.env.MSSQL6_PASSWORD || '',
            database: '',
            server: process.env.MSSQL6_SERVER || '',
            pool: {
                max: 10,
                min: 2,
                idleTimeoutMillis: 30000,
            },
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        });
        pool.on('error', (err) => {
            console.error('MSSQL6 pool error:', err);
            pool = null;
        });
        return pool;
    });
}
function mssqlquery6(query, params) {
    return __awaiter(this, void 0, void 0, function* () {
        const p = yield getPool();
        const request = p.request();
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                request.input(key, value);
            }
        }
        return request.query(query);
    });
}
exports.mssqlquery6 = mssqlquery6;
