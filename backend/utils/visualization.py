import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
import json
import plotly

def create_leakage_distribution_chart(df, domain):
    """Create distribution chart for leakage detection"""
    try:
        if domain == "supermarket":
            col = "Leakage_Flag_Pred"
        else:
            col = "Leakage"
        
        counts = df[col].value_counts()
        
        fig = go.Figure(data=[
            go.Bar(x=counts.index, y=counts.values, 
                  marker_color=['#2E8B57', '#DC143C'])
        ])
        
        fig.update_layout(
            title="Revenue Leakage Distribution",
            xaxis_title="Leakage Status",
            yaxis_title="Count",
            template="plotly_white"
        )
        
        return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    
    except Exception as e:
        raise Exception(f"Failed to create leakage distribution chart: {str(e)}")

def create_anomaly_type_chart(df, domain):
    """Create chart for anomaly types"""
    try:
        if domain == "supermarket":
            col = "Anomaly_Type_Pred"
        else:
            col = "Anomaly_type"
        
        counts = df[col].value_counts()
        
        fig = go.Figure(data=[
            go.Pie(labels=counts.index, values=counts.values, hole=0.3)
        ])
        
        fig.update_layout(
            title="Anomaly Type Distribution",
            template="plotly_white"
        )
        
        return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    
    except Exception as e:
        raise Exception(f"Failed to create anomaly type chart: {str(e)}")

def create_risk_timeline_chart(df, domain):
    """Create timeline chart showing risk over time"""
    try:
        # Find date column
        date_cols = [col for col in df.columns if 'date' in col.lower() or 'time' in col.lower()]
        
        if not date_cols:
            return None
        
        date_col = date_cols[0]
        
        if domain == "supermarket":
            risk_col = "Leakage_Flag_Pred"
            risk_value = "Anomaly"
        else:
            risk_col = "Leakage"
            risk_value = "Yes"
        
        # Convert to datetime
        df_copy = df.copy()
        df_copy[date_col] = pd.to_datetime(df_copy[date_col], errors='coerce')
        df_copy = df_copy.dropna(subset=[date_col])
        
        # Group by date and count risks
        df_copy['is_risk'] = (df_copy[risk_col] == risk_value).astype(int)
        daily_risk = df_copy.groupby(df_copy[date_col].dt.date).agg({
            'is_risk': 'sum',
            risk_col: 'count'
        }).rename(columns={risk_col: 'total_records'})
        
        daily_risk['risk_percentage'] = (daily_risk['is_risk'] / daily_risk['total_records']) * 100
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=daily_risk.index,
            y=daily_risk['risk_percentage'],
            mode='lines+markers',
            name='Risk Percentage',
            line=dict(color='#DC143C', width=2)
        ))
        
        fig.update_layout(
            title="Risk Trends Over Time",
            xaxis_title="Date",
            yaxis_title="Risk Percentage (%)",
            template="plotly_white"
        )
        
        return json.dumps(fig, cls=plotly.utils.PlotlyJSONEncoder)
    
    except Exception:
        return None

def generate_visualization_data(df, domain):
    """Generate all visualization data"""
    try:
        charts = {}
        
        charts['leakage_distribution'] = create_leakage_distribution_chart(df, domain)
        charts['anomaly_types'] = create_anomaly_type_chart(df, domain)
        
        timeline_chart = create_risk_timeline_chart(df, domain)
        if timeline_chart:
            charts['risk_timeline'] = timeline_chart
        
        return charts
    
    except Exception as e:
        raise Exception(f"Failed to generate visualization data: {str(e)}")