CREATE TABLE Users (
  Username VARCHAR(30) PRIMARY KEY,
  Email VARCHAR(50) UNIQUE NOT NULL,
  Password VARCHAR(255) NOT NULL
);

CREATE TABLE Notes (
  Title VARCHAR(50),
  Content TEXT,
  Creation_Date DATETIME NOT NULL,
  Last_Modified_Date DATETIME NOT NULL,
  Username_FK VARCHAR(30) NOT NULL,
  FOREIGN KEY (Username_FK) REFERENCES Users(Username) ON DELETE CASCADE,
  PRIMARY KEY (Username_FK, Creation_date)
);
