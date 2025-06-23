//
//  Constants.swift
//  TargetStock
//
//  Created by Sarthak Roongta on 6/23/25.
//


enum Constants {
#if targetEnvironment(simulator)
   static let apiBase = "http://localhost:3001/api"
   #else
   static let apiBase = "http://10.0.0.44:3001/api"   
   #endif
}
