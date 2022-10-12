create database perfectc9;
\c perfect-c9;
create role admin with password '123' superuser;
alter role admin with login;

create table users (
    id serial unique primary key,
    username varchar(30) not null unique,
    password varchar(255) not null,
);