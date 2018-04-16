import json

neighbourhoods = {}

categories = {
    "food": ["Fruits", "Vegetables", "Fish, Meat, Eggs", "Stimulants", "Oils, nuts, legumes", "Grains", "Dairy", "Beverages"],
    "building": ["Materials", "Electricity", "Gas"],
    "consumables": ["Paper", "Plastic", "Rubber", "Metals", "Glass", "Household Hygiene", "Other"],
    "transportation": ["Materials", "Vehicle travel", "Air travel"],
    "totals": ["Per Capita", "Planets"]
}

def place_into(data, value, line_number, year, neighbourhood, household):
    if line_number < 8:
        offset = 0
        cat = "food"
    elif line_number < 11:
        offset = 11
        cat = "building"
    elif line_number < 18:
        offset = 18
        cat = "consumables"

        # # skip rubber!
        if line_number == 13:
            return data

    elif line_number < 21:
        offset = 21
        cat = "transportation"
    elif line_number == 26 or line_number == 27:
        offset = 26
        cat = "totals"
    elif line_number > 28:
        raise ValueError("Unknown category: %d" % line_number)
    # skip other "total" values
    else:
        return data

    try:
        cat_type = categories[cat][line_number - offset]
    except:
        raise ValueError("Unknown category value type: %s - %d" % (cat, cat_type))

    if not neighbourhood in data:
        data[neighbourhood] = {}

    if not household in data[neighbourhood]:
        data[neighbourhood][household] = {}

    if not year in data[neighbourhood][household]:
        data[neighbourhood][household][year] = {}

    if not cat in data[neighbourhood][household][year]:
        data[neighbourhood][household][year][cat] = {}

    data[neighbourhood][household][year][cat][cat_type] = value

    return data

with open("raw_data") as f:
    data = f.read()
    lines = data.split("\n")

    current_year = ""
    current_neighbourhood = ""
    current_household = ""
    current_line_number = 0

    # for each line...
    for line in lines:
        # skip empty lines
        if line == "\n":
            continue

        # is this line a number value? "floating point number"
        try:
            f = float(line)

            neighbourhoods = place_into(neighbourhoods, f, current_line_number, current_year, current_neighbourhood, current_household)

            current_line_number += 1

        # no, it's not a number - must be a neighbourhood, year, household...
        except ValueError:
            try:
                s = str(line)

                # is it neighbourhood?
                if "N:" in s:
                    current_neighbourhood = s.split("N: ")[1]
                # .. or year?
                elif "Y:" in s:
                    current_year = s.split("Y: ")[1]
                # .. must be name of the household
                else:
                    current_household = s

                current_line_number = 0
            # line is not even a string - must be bad data, give up
            except:
                raise ValueError("BAD DATA")

print "var neighbourhoods = %s;" % json.dumps(neighbourhoods, indent=2)