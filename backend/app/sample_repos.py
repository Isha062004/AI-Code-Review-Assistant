"""
Pre-populated multi-language repository snippets for instant demonstration.
"""

SAMPLE_SNIPPETS = {
    "python_fib_n1": {
        "filename": "fibonacci_and_db.py",
        "language": "python",
        "title": "Python: Exponential Fibonacci & N+1 Query Anti-Pattern",
        "description": "Contains O(2^N) recursive algorithm and N+1 database queries inside loop.",
        "code": '''import time
import os

# Secret key hardcoded anti-pattern
API_SECRET_KEY = "sk_live_99887766554433221100"

# O(2^N) Recursive Fibonacci bug
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)

# N+1 Query & Unhandled Exception anti-pattern
def fetch_user_orders(db, user_list):
    results = []
    # N+1 Query bug: DB query inside for loop
    for user in user_list:
        try:
            orders = db.query("SELECT * FROM orders WHERE user_id = " + str(user.id))
            results.append({"user": user.name, "orders": orders})
        except:
            # Bare except clause
            pass
    return results

def process_data(a, b, c, d, e, f, g):
    # Too many parameters (7 parameters)
    eval(a)  # Dangerous function call RCE risk
    return a + b
'''
    },
    "js_async_memory": {
        "filename": "user_service.js",
        "language": "javascript",
        "title": "JavaScript/TS: Unhandled Promises & O(N^2) Duplicate Scanner",
        "description": "Contains nested loop O(N^2) duplicate search, unhandled promise, and var usage.",
        "code": '''// Legacy var declarations & hardcoded token
var JWT_SECRET = "super_secret_jwt_token_12345";

// O(N^2) Nested loop duplicate checker
function findDuplicateUsers(userArray) {
  var duplicates = [];
  for (var i = 0; i < userArray.length; i++) {
    for (var j = i + 1; j < userArray.length; j++) {
      if (userArray[i].id === userArray[j].id) {
        duplicates.push(userArray[i]);
      }
    }
  }
  return duplicates;
}

// Unhandled async error boundary
async function syncUserData(userId) {
  const response = await fetch('/api/users/' + userId);
  const data = await response.json();
  console.log("Synced user: ", data);
}
'''
    },
    "cpp_memory_leak": {
        "filename": "graph_processor.cpp",
        "language": "cpp",
        "title": "C++: Heap Allocation Memory Leak & Raw Pointer Risk",
        "description": "Demonstrates heap memory allocation via 'new' without matching 'delete', and unsafe array bound access.",
        "code": '''#include <iostream>
#include <vector>

struct Node {
    int id;
    int data;
    Node* next;
};

void processGraphData(int numNodes) {
    // Memory leak bug: raw pointers allocated with new without delete
    for (int i = 0; i < numNodes; ++i) {
        Node* n = new Node();
        n->id = i;
        n->data = i * 100;
        // missing delete n;
    }
}

int main() {
    std::cout << "Starting Graph Processing..." << std::endl;
    processGraphData(10000);
    return 0;
}
'''
    },
    "java_n1_sql": {
        "filename": "OrderController.java",
        "language": "java",
        "title": "Java: Spring Data N+1 Query & High Cyclomatic Complexity",
        "description": "Spring Boot controller with inline SQL concatenation vulnerability and deeply nested conditionals.",
        "code": '''package com.app.controller;

import java.sql.*;
import java.util.*;

public class OrderController {
    
    public List<String> processOrders(Connection conn, List<Integer> customerIds) throws SQLException {
        List<String> results = new ArrayList<>();
        
        // N+1 DB query execution inside loop
        for (Integer id : customerIds) {
            String sql = "SELECT * FROM orders WHERE customer_id = " + id; // SQL Injection risk
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery(sql);
            
            while (rs.next()) {
                if (rs.getDouble("total") > 100.0) {
                    if (rs.getString("status").equals("PENDING")) {
                        if (rs.getInt("priority") == 1) {
                            results.add(rs.getString("order_number"));
                        }
                    }
                }
            }
        }
        return results;
    }
}
'''
    }
}
