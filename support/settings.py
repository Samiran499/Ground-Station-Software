import sys
import json

# Read the JSON data from standard input
json_data = sys.stdin.read()
# Parse the JSON data
data = json.loads(json_data)

# conf = {key : value["value"] for key, value in data["chartPoints"].items()}

# with open('C:/rtgs/chart_conf.json', 'w') as file1:
#     json.dump(conf, file1)
# Specify the file path and name

# Save the JSON data to the file
with open('C:/rtgs/conf.json', 'w') as file:
    json.dump(data, file)

print("JSON data saved")

# Flush the output
sys.stdout.flush()
