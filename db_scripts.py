import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()
SCRIPT_FOLDER = "db/"

class FlyWheeler:
    def __init__(self):
        self.conn = None

    def execute_script(self, name):
        scripts = {}
        for filename in os.listdir(SCRIPT_FOLDER):
            if not filename.endswith('.sql'):
                continue

            identifier = filename.split('__')[0] if filename.endswith('__.sql') else filename.split('.')[0]
            scripts[identifier] = filename.split('.')[0]

        name = scripts[name]

        script_path = os.path.join(SCRIPT_FOLDER, name + ".sql")

        script = None
        with open(script_path, "r") as f:
            script = f.read()

        if script == None:
            raise Exception("Script not found")
        
        # Right now this is purely execution, no fetching results.
        cur = self.conn.cursor()
        for command in script.split(";"):
            if command == "":
                continue

            print("Excuting:", command)
            cur.execute(command)
        cur.close()
        self.conn.commit()

    def open_connection(self):
        self.conn = psycopg2.connect(
            host=os.environ['DB_HOST'],
            database=os.environ['DB_DATABASE'],
            user=os.environ['DB_USERNAME'],
            password=os.environ['DB_PASSWORD']
        )

    def close_connection(self):
        self.conn.close()

    def flywheel(self):
        scripts = []

        for filename in os.listdir(SCRIPT_FOLDER):
            if not filename.endswith('__.sql'):
                continue

            ordinal = int(filename.split("__")[1])
            name = filename.split("__")[0]
            scripts.append((ordinal, name))

        scripts.sort()
        for script in scripts:
            self.execute_script(script[1])

if __name__ == '__main__':
    print("I really envisioned this file being used from the python REPL.")