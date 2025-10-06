from sqlalchemy import create_engine #connection between app and database without it you cant send queries
from sqlalchemy.orm import sessionmaker, declarative_base #session is writing down the workouts and at the end either commit and save to the database or rollback
#base is like a bluebrint maker ex/ class WorkoutSession(Base): sql says that supposed to be a table in the database
#ORM is the object relational mapper O = python class, R = database table, Mapper = matches them up

SQLALCHEMY_DATABASE_URL = "sqlite:///./sweat.db" #switch to postgres later

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args = {"check_same_thread": False}) #remove connect_args in Postgres
#check_same_thread relaxes default rule of SQLite that says that only one thread can open a database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
#autocommit = false so that you can call db.commit() explicitly
#use like db = SessionLocal() inside requests
Base = declarative_base()

#dependency
def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

        