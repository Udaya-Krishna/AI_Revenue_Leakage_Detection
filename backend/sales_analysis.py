import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime

# Set style for plots
sns.set(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 6)

# Load the data
df = pd.read_csv('input_dataset_cleaned.csv')

# Convert date columns to datetime
df['Billing_Date'] = pd.to_datetime(df['Billing_Date'], format='%d-%m-%Y')

# 1. Basic Data Overview
def basic_data_overview():
    print("\n=== Basic Data Overview ===")
    print(f"Total Records: {len(df)}")
    print(f"Date Range: {df['Billing_Date'].min().date()} to {df['Billing_Date'].max().date()}")
    print(f"\nMissing Values:\n{df.isnull().sum()}")
    print(f"\nData Types:\n{df.dtypes}")

# 2. Sales Analysis
def sales_analysis():
    print("\n=== Sales Analysis ===")
    
    # Monthly sales trend
    monthly_sales = df[df['Transaction_Type'] == 'Sale'].groupby(
        pd.Grouper(key='Billing_Date', freq='M'))['Billed_Amount'].sum()
    
    # Payment status distribution
    payment_status = df['Payment_Status'].value_counts(normalize=True) * 100
    
    # Top product categories
    top_categories = df[df['Transaction_Type'] == 'Sale'].groupby('Product_Category')['Billed_Amount'].sum().nlargest(5)
    
    # Payment method distribution
    payment_methods = df['Mode_of_Payment'].value_counts()
    
    return {
        'monthly_sales': monthly_sales,
        'payment_status': payment_status,
        'top_categories': top_categories,
        'payment_methods': payment_methods
    }

# 3. Generate Visualizations
def generate_visualizations(analysis_results):
    # Monthly Sales Trend
    plt.figure(figsize=(14, 6))
    analysis_results['monthly_sales'].plot(kind='line', marker='o')
    plt.title('Monthly Sales Trend')
    plt.xlabel('Date')
    plt.ylabel('Total Sales Amount')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('monthly_sales_trend.png')
    plt.close()
    
    # Payment Status Distribution
    plt.figure(figsize=(10, 6))
    analysis_results['payment_status'].plot(kind='pie', autopct='%1.1f%%', startangle=90)
    plt.title('Payment Status Distribution')
    plt.ylabel('')
    plt.tight_layout()
    plt.savefig('payment_status_distribution.png')
    plt.close()
    
    # Top Product Categories
    plt.figure(figsize=(12, 6))
    analysis_results['top_categories'].plot(kind='bar')
    plt.title('Top 5 Product Categories by Sales')
    plt.xlabel('Product Category')
    plt.ylabel('Total Sales Amount')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('top_categories.png')
    plt.close()
    
    # Payment Methods
    plt.figure(figsize=(10, 6))
    analysis_results['payment_methods'].plot(kind='bar')
    plt.title('Payment Method Distribution')
    plt.xlabel('Payment Method')
    plt.ylabel('Number of Transactions')
    plt.xticks(rotation=45, ha='right')
    plt.tight_layout()
    plt.savefig('payment_methods.png')
    plt.close()

# 4. Generate Report
def generate_report(analysis_results):
    report = """
# Sales Analysis Report

## 1. Executive Summary
- Total records analyzed: {total_records}
- Date range: {start_date} to {end_date}
- Total sales amount: ${total_sales:,.2f}
- Average transaction value: ${avg_transaction:,.2f}

## 2. Key Insights
- Most popular payment method: {top_payment_method} ({top_payment_pct:.1f}% of transactions)
- Top product category by sales: {top_category} (${top_category_sales:,.2f})
- Payment Success Rate: {success_rate:.1f}%

## 3. Visualizations
Please refer to the generated charts for visual representation of the data.
"""
    
    total_sales = analysis_results['monthly_sales'].sum()
    avg_transaction = total_sales / len(df[df['Transaction_Type'] == 'Sale'])
    success_rate = analysis_results['payment_status'].get('Paid', 0)
    
    return report.format(
        total_records=len(df),
        start_date=df['Billing_Date'].min().date(),
        end_date=df['Billing_Date'].max().date(),
        total_sales=total_sales,
        avg_transaction=avg_transaction,
        top_payment_method=analysis_results['payment_methods'].index[0],
        top_payment_pct=(analysis_results['payment_methods'][0] / analysis_results['payment_methods'].sum()) * 100,
        top_category=analysis_results['top_categories'].index[0],
        top_category_sales=analysis_results['top_categories'].iloc[0],
        success_rate=success_rate
    )

# Main execution
if __name__ == "__main__":
    print("Starting sales data analysis...")
    
    # 1. Basic Data Overview
    basic_data_overview()
    
    # 2. Perform Analysis
    analysis_results = sales_analysis()
    
    # 3. Generate Visualizations
    print("\nGenerating visualizations...")
    generate_visualizations(analysis_results)
    
    # 4. Generate Report
    report = generate_report(analysis_results)
    with open('sales_analysis_report.md', 'w') as f:
        f.write(report)
    
    print("\nAnalysis complete! Check the following files:")
    print("- sales_analysis_report.md (Summary report)")
    print("- monthly_sales_trend.png")
    print("- payment_status_distribution.png")
    print("- top_categories.png")
    print("- payment_methods.png")
    
    # Print a quick summary
    print("\n=== Quick Summary ===")
    print(f"Total Sales: ${analysis_results['monthly_sales'].sum():,.2f}")
    print(f"Payment Success Rate: {analysis_results['payment_status'].get('Paid', 0):.1f}%")
    print(f"Top Category: {analysis_results['top_categories'].index[0]} (${analysis_results['top_categories'].iloc[0]:,.2f})")
