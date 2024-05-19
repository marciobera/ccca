drop schema ccca cascade;

create schema ccca;

create table ccca.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false
);

create table ccca.ride (
	ride_id uuid primary key,
	passenger_id uuid,
	driver_id uuid,
	fare numeric,
	distance numeric,
	status text,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
	last_lat numeric,
	last_long numeric,
	date timestamp
);
