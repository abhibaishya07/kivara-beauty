const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  reviewText: {
    type: String,
    required: true,
    trim: true,
  },
  audioFilePath: {
    type: String,
    default: null, // Optional path if they uploaded an audio review
  },
  sentimentScore: {
    type: Number,
    default: null, // To be populated by your Python AI microservice
  },
  flaggedForReview: {
    type: Boolean,
    default: false, // True if 5-star but negative sentiment, or contains profanity
  }
}, { timestamps: true });

// Prevent a user from submitting more than one review per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to easily calculate the average rating for a product
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId, flaggedForReview: false }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        numOfReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    if (stats.length > 0) {
      await this.model('Product').findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
        numReviews: stats[0].numOfReviews
      });
    } else {
      await this.model('Product').findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAverageRating after saving a review
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

// Call calculateAverageRating after removing a review
reviewSchema.post('remove', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
