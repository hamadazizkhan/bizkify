import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _currentIndex = 0;

  final List<Widget> _pages = [
    Center(child: Text('Expenses Section Placeholder')),
    Center(child: Text('Procurement Section Placeholder')),
    Center(child: Text('Analytics Section Placeholder')),
  ];

  @override
  void initState() {
    super.initState();
    _checkUserAuthentication();
  }

  Future<void> _checkUserAuthentication() async {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: 'Dashboard',
            items: [
              DropdownMenuItem(
                value: 'Dashboard',
                child: Text('Dashboard', style: TextStyle(color: Colors.white)),
              ),
              DropdownMenuItem(
                value: 'OCR Expense Tracking',
                child: Text('OCR Expense Tracking'),
              ),
              DropdownMenuItem(
                value: 'Predictive Budgeting',
                child: Text('Predictive Budgeting'),
              ),
              DropdownMenuItem(
                value: 'Procurement Optimization',
                child: Text('Procurement Optimization'),
              ),
              DropdownMenuItem(
                value: 'Visual Analytics',
                child: Text('Visual Analytics'),
              ),
            ],
            onChanged: (value) {
              if (value != null) {
                // Navigate based on selected feature
                print('Selected: $value');
              }
            },
            dropdownColor: Colors.blue.shade800,
            style: const TextStyle(color: Colors.white),
            icon: const Icon(Icons.arrow_drop_down, color: Colors.white),
          ),
        ),
        backgroundColor: Colors.blue,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await FirebaseAuth.instance.signOut();
              Navigator.of(context).pushReplacementNamed('/login');
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Wrap Summary Cards in SingleChildScrollView to avoid overflow
          SingleChildScrollView(
            scrollDirection: Axis.horizontal, // Enable horizontal scrolling
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildSummaryCard('Total Expenses', '\$1200'),
                  _buildSummaryCard('Procurement', '\$850'),
                  _buildSummaryCard('Budget Remaining', '\$350'),
                ],
              ),
            ),
          ),

          // Widgets Section
          Expanded(
            child: _pages[_currentIndex],
          ),
        ],
      ),
    );
  }

  // Widget for Summary Cards
  Widget _buildSummaryCard(String title, String value) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      child: Container(
        width: 100,
        height: 80, // Reduced height to fit within the screen
        padding: const EdgeInsets.all(8),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 4),
            Text(
              value,
              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.blue),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
