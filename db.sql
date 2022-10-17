-- create role admin with password '123' superuser;
-- alter role admin with login;

create table users (
    id serial unique primary key,
    username varchar(30) not null unique,
    password varchar(255) not null
);

insert into users (username, password) values ('forever', 'young');
