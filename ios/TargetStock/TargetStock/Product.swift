import Foundation

struct Product: Codable, Identifiable, Equatable {
    let id:     String         // Mongo_id
    let name:   String
    let inStock: Bool
    let url:    String
}
