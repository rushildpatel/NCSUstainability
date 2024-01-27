import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from statsmodels.tsa.arima.model import ARIMA
from dotenv import load_dotenv
import numpy as np
import os
import shutil

load_dotenv()
BASE_DIR = os.getenv('BASE_DIR')

def clear_directory(directory_path):
    # Check if the directory exists
    if os.path.exists(directory_path):
        # Iterate over all the entries in the directory
        for entry in os.listdir(directory_path):
            entry_path = os.path.join(directory_path, entry)

            # If it's a file, delete it
            if os.path.isfile(entry_path):
                os.unlink(entry_path)

            # If it's a directory, delete it recursively
            elif os.path.isdir(entry_path):
                shutil.rmtree(entry_path)

    else:
        pass
        # print(f"The directory {directory_path} does not exist.")

# Example usage
directory_to_clear = BASE_DIR + '/graphs/tuffys'
clear_directory(directory_to_clear)


# Load the Excel file
file_path = BASE_DIR + '/data/tuffy_data.xlsx'

# Reading the Excel file to see the sheet names and the structure of the data
xls = pd.ExcelFile(file_path)
sheet_names = xls.sheet_names


# Consolidating all sheets into a single DataFrame
def consolidate_sheet():
    all_data = pd.DataFrame()
    print(type(all_data))
    for sheet_name in sheet_names:
        sheet_data = pd.read_excel(xls, sheet_name=sheet_name)
        # Adding a column to identify the day
        sheet_data['Day'] = int(sheet_name.strip('Sheet'))
        all_data = all_data.append(sheet_data, ignore_index=True)

    # Convert 'Item Amount' from string to float for calculations
    # Removing the dollar sign and converting to float
    all_data['Item Amount'] = all_data['Item Amount'].replace('[\$,]', '', regex=True).astype(float)

    # Checking the consolidated data and data types
    # all_data.info(), all_data.head()
    return all_data

def clean_data(all_data):
    # Removing unnecessary columns
    columns_to_drop = ['Unnamed: 6', 'Unnamed: 7', 'Venue ld', 'Campus\nNorth', 'Unnamed: 0']
    all_data_cleaned = all_data.drop(columns=columns_to_drop, errors='ignore')

    # Handling missing data
    # For simplicity, we'll fill missing numeric values with 0 and categorical values with 'Unknown'
    numeric_cols = ['Item Count', 'Item Amount']
    categorical_cols = ['Campus', 'Venue Id', 'Rank', 'Item Id', 'Venue', 'Item']

    all_data_cleaned[numeric_cols] = all_data_cleaned[numeric_cols].fillna(0)
    all_data_cleaned[categorical_cols] = all_data_cleaned[categorical_cols].fillna('Unknown')

    # Cleaning the 'Item Count' column by removing non-numeric characters and then converting to float
    all_data_cleaned['Item Count'] = all_data_cleaned['Item Count'].replace('[^\d.]', '', regex=True).astype(float)

    # Re-checking the data types after cleaning
    all_data_cleaned.info(), all_data_cleaned.head()

    return all_data_cleaned

def sales_trends():
    # Setting the aesthetic style of the plots
    sns.set(style="whitegrid")

    # Analysis 1: Sales Trends Over Time
    # Summing up the total sales amount per day
    sales_trends = all_data_cleaned.groupby('Day')['Item Amount'].sum()

    # Plotting the sales trends over time
    plt.figure(figsize=(12, 6))
    sales_trends.plot(kind='line', marker='o')
    plt.title('Sales Trends Over 22 Days')
    plt.xlabel('Day')
    plt.ylabel('Total Sales Amount ($)')
    plt.xticks(range(1, 23))
    plt.grid(True)
    # plt.show()
    
    plt.savefig(BASE_DIR + '/graphs/tuffys/sales_trends.png')

    # Analysis 2: Most Popular Items
    # Summing up the total item count per item and sorting
    popular_items = all_data_cleaned.groupby('Item')['Item Count'].sum().sort_values(ascending=False).head(10)

    # Plotting the most popular items
    plt.figure(figsize=(12, 6))
    popular_items.plot(kind='bar')
    plt.title('Top 10 Most Popular Items')
    plt.xlabel('Item')
    plt.ylabel('Total Quantity Sold')
    plt.xticks(rotation=45, ha='right')
    # plt.show()
    plt.savefig(BASE_DIR + '/graphs/tuffys/popular_items.png')

    # Analysis 3: Daily Sales Patterns
    # Summing up the total sales amount per day
    daily_sales = all_data_cleaned.groupby('Day')['Item Amount'].sum()

    # Plotting the daily sales patterns
    plt.figure(figsize=(12, 6))
    daily_sales.plot(kind='bar')
    plt.title('Daily Sales Patterns')
    plt.xlabel('Day')
    plt.ylabel('Total Sales Amount ($)')
    plt.xticks(range(1, 23))
    # plt.show()
    plt.savefig(BASE_DIR + '/graphs/tuffys/daily_sales.png')

    # Analysis 4: Item-Level Analysis
    # Summing up the total sales amount per item and sorting
    item_sales = all_data_cleaned.groupby('Item')['Item Amount'].sum().sort_values(ascending=False).head(10)

    # Plotting the item-level sales analysis
    plt.figure(figsize=(12, 6))
    item_sales.plot(kind='bar')
    plt.title('Top 10 Items by Sales Amount')
    plt.xlabel('Item')
    plt.ylabel('Total Sales Amount ($)')
    plt.xticks(rotation=45, ha='right')
    # plt.show()
    plt.savefig(BASE_DIR + '/graphs/tuffys/item_sales.png')

    return 0

all_data = consolidate_sheet()
all_data_cleaned = clean_data(all_data)
unique_item_counts = all_data_cleaned['Item Count'].unique()
sales_trends()

exit()
