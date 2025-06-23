//
//  API.swift
//  TargetStock
//
//  Created by Sarthak Roongta on 6/23/25.
//

import Foundation
enum API {
    static func fetchProducts(jwt: String) async throws -> [Product] {
        var req = URLRequest(url: URL(string: "\(Constants.apiBase)/products")!)
        req.addValue("Bearer \(jwt)", forHTTPHeaderField: "Authorization")
        let (data, _) = try await URLSession.shared.data(for: req)
        return try JSONDecoder().decode([Product].self, from: data)
    }
}
