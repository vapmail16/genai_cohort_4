from activity_selector import create_activity_graph
from IPython.display import Image, display

# Create the graph
graph = create_activity_graph()

# Display the graph structure
print("📊 Graph Structure:")
print(graph.get_graph().draw_mermaid())

# If you want to see it as an image (requires additional setup)
# display(Image(graph.get_graph().draw_mermaid_png()))