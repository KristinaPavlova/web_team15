
insert into Users(Username, Email, Password)
values(
'aaa', 'aa@a.com', '123aaa')

insert into Notes(Title, Content, Creation_Date, Last_Modified_Date, Username_FK)
values(
'proba', 'dali shte stane', GETDATE(), GETDATE(), 'aaa')

insert into Notes(Title, Content, Creation_Date, Last_Modified_Date, Username_FK)
values(
'proba2', 'dali shte stane2', GETDATE(), GETDATE(), 'aaa')

select * from Notes

select * from Users