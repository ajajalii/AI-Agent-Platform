"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const env_1 = require("./env");
const globalForPrisma = globalThis;
function normalizeDatabaseUrl(connectionString) {
    try {
        const url = new URL(connectionString);
        const sslMode = url.searchParams.get("sslmode");
        if (sslMode === "prefer" ||
            sslMode === "require" ||
            sslMode === "verify-ca") {
            url.searchParams.set("sslmode", "verify-full");
            return url.toString();
        }
    }
    catch {
        return connectionString;
    }
    return connectionString;
}
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: normalizeDatabaseUrl(env_1.env.DATABASE_URL),
});
exports.prisma = globalForPrisma.prisma ||
    new client_1.PrismaClient({
        adapter,
        log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
//# sourceMappingURL=database.js.map