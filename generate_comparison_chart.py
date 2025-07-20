import pandas as pd
import matplotlib.pyplot as plt
import numpy as np

# Read the original data files
print("Reading USA data...")
usa_data = pd.read_excel('Final_datasets/annotated_USA_100.xlsx', header=1)
print("Reading Australia data...")
aus_data = pd.read_excel('Final_datasets/annotated_Australia_100.xlsx', header=1)

# Debug: Check column names
print("USA columns:", usa_data.columns.tolist())
print("Australia columns:", aus_data.columns.tolist())

# Extract narrative columns - check for different possible column names
if 'NARRATIVE' in usa_data.columns:
    usa_narratives = usa_data['NARRATIVE'].value_counts()
elif 'Narrative' in usa_data.columns:
    usa_narratives = usa_data['Narrative'].value_counts()
else:
    print("Available USA columns:", usa_data.columns.tolist())
    raise ValueError("Could not find narrative column in USA data")

if 'Narrative' in aus_data.columns:
    aus_narratives = aus_data['Narrative'].value_counts()
elif 'NARRATIVE' in aus_data.columns:
    aus_narratives = aus_data['NARRATIVE'].value_counts()
else:
    print("Available Australia columns:", aus_data.columns.tolist())
    raise ValueError("Could not find narrative column in Australia data")

# Get all unique narratives
all_narratives = set(usa_narratives.index.tolist() + aus_narratives.index.tolist())

# Calculate counts and percentages
usa_total = len(usa_data)
aus_total = len(aus_data)

comparison_data = []
for narrative in all_narratives:
    usa_count = usa_narratives.get(narrative, 0)
    aus_count = aus_narratives.get(narrative, 0)
    usa_pct = (usa_count / usa_total) * 100
    aus_pct = (aus_count / aus_total) * 100
    
    comparison_data.append({
        'Narrative': narrative,
        'USA_Count': usa_count,
        'USA_Percentage_num': usa_pct,
        'Australia_Count': aus_count,
        'Australia_Percentage_num': aus_pct,
        'Difference': usa_pct - aus_pct
    })

# Create DataFrame
df = pd.DataFrame(comparison_data)

# Sort by USA percentage for better visualization
df = df.sort_values('USA_Percentage_num', ascending=True)

print(f"USA dataset: {usa_total} articles")
print(f"Australia dataset: {aus_total} articles")
print(f"Total unique narratives: {len(all_narratives)}")

# Create the plot
fig, ax = plt.subplots(figsize=(14, 12))

# Set up the bar positions
y_pos = np.arange(len(df))
bar_width = 0.35

# Create bars
usa_bars = ax.barh(y_pos - bar_width/2, df['USA_Percentage_num'], bar_width, 
                   label='USA', color='#1f77b4', alpha=0.8)
aus_bars = ax.barh(y_pos + bar_width/2, df['Australia_Percentage_num'], bar_width,
                   label='Australia', color='#ff7f0e', alpha=0.8)

# Create mapping from actual narrative names to display labels
narrative_mapping = {
    '12_YEARS': '12 years to save the world',
    'ALL_GOING_TO_DIE': 'We are all going to die',
    'ALL_TALK': 'All talk little action',
    'CARBON_EXPANSION': 'Carbon fueled expansion',
    'CLIMATE_SOLUTIONS_WONT_WORK': "Climate solutions won't work",
    'COLLAPSE_IS_IMMINENT': "Collapse is imminent",
    'DEBATE_AND_SCAM': "Debate and scam",
    'ENDANGERED_SPECIES': "Endangered species",
    'EVERY_LITTLE_HELPS': "Every little helps",
    'GORE': "Gore",
    'NO_NEED_TO_ACT': "No need to act",
    'NO_STICKS': "No sticks just carrots",
    'OFFICIALS_DECLARE_EMERGENCY': "Officials declare emergency",
    'OTHERS_ARE_WORSE': "Others are worse than us",
    'TECHNOLOGICAL_OPTIMISM': "Technological optimism",
    'VICTIM_BLAMING': "Victim blaming",
    'YOURE_DESTROYING_OUR_FUTURE': "You're destroying our future",
    # Additional narratives found in data
    'ADAPTATION': "Adaptation",
    'FOSSIL_FUEL_SOLUTIOINISM': "Fossil fuel solutionism",
    'POLLUTION_IS_CHOKING': "Pollution is choking our planet",
    'WIN_WIN': "Win-win scenario"
}

# Map the actual narrative names to display labels
display_labels = [narrative_mapping.get(narrative, narrative) for narrative in df['Narrative']]

# Customize the plot
ax.set_xlabel('Percentage (%)', fontsize=12)
ax.set_ylabel('Narrative', fontsize=12)
ax.set_title('Distribution of Climate Narratives: USA vs Australia', fontsize=14, fontweight='bold')
ax.set_yticks(y_pos)
ax.set_yticklabels(display_labels, fontsize=10)
ax.legend(fontsize=12)

# Add value labels on bars
for i, (usa_val, aus_val) in enumerate(zip(df['USA_Percentage_num'], df['Australia_Percentage_num'])):
    if usa_val > 0:
        ax.text(usa_val + 0.2, i - bar_width/2, f'{usa_val:.1f}%', 
                va='center', fontsize=8)
    if aus_val > 0:
        ax.text(aus_val + 0.2, i + bar_width/2, f'{aus_val:.1f}%', 
                va='center', fontsize=8)

# Adjust layout and grid
ax.grid(axis='x', alpha=0.3)
ax.set_xlim(0, max(df['USA_Percentage_num'].max(), df['Australia_Percentage_num'].max()) + 3)

plt.tight_layout()

# Save the plot
plt.savefig('images/comparison.png', dpi=300, bbox_inches='tight')
print("Chart saved as images/comparison.png")

# Also save the data for reference
df.to_csv('comparison_data.csv', index=False)
print("Data saved as comparison_data.csv")

plt.show()
