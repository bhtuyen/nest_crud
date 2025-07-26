-- CreateTable
CREATE TABLE "User" (
    "ID" TEXT NOT NULL PRIMARY KEY,
    "Email" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "ID" TEXT NOT NULL PRIMARY KEY,
    "Title" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "AuthorID" TEXT NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" DATETIME NOT NULL,
    CONSTRAINT "Post_AuthorID_fkey" FOREIGN KEY ("AuthorID") REFERENCES "User" ("ID") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "Token" TEXT NOT NULL,
    "UserID" TEXT NOT NULL,
    "ExpiresAt" DATETIME NOT NULL,
    "CreatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User" ("ID") ON DELETE CASCADE ON UPDATE NO ACTION
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_Token_key" ON "RefreshToken"("Token");
