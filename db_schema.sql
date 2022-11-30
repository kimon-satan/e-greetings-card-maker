
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS Cards (
    CardId CHAR(12) PRIMARY KEY NOT NULL,
    Recipient TEXT NOT NULL CHECK(length(Recipient) <= 32),
    CardType  TEXT NOT NULL CHECK(CardType IN ('birthday', 'leaving'))
);

CREATE TABLE IF NOT EXISTS Messages (
    MessageId INTEGER PRIMARY KEY AUTOINCREMENT,
    _Message TEXT NOT NULL CHECK(length(_Message) <= 255),
    _From TEXT NOT NULL CHECK(length(_From) <= 32),
    CardId  CHAR(12), --the card that the message belongs to
    FOREIGN KEY (CardId) REFERENCES Cards(CardId)
);

--insert default data (if necessary here)


COMMIT;
