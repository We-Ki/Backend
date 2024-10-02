const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

//사용자 모델 스키마
const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "사용자 명을 입력해주세요"],
      match: [/^.{4,12}$/, "4~12 글자로 입력해주세요"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "비밀번호를 입력해주세요"],
      select: false,
    },
    name: {
      type: String,
      required: [true, "성명을 입력해주세요"],
      match: [/^.{2,12}$/, "2~12 글자로 입력해주세요"],
    },
    email: {
      type: String,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "올바른 형식의 이메일 주소를 입력해주세요",
      ],
      trim: true,
    },
    userGroup: {
      type: String,
      enum: ["user", "farmer"],
      default: "user",
    },
    point: {
      type: Number,
      default: 0,
    },
  },
  {
    toObject: { virtuals: true },
    versionKey: false,
  }
);

//가상 항목
userSchema
  .virtual("passwordConfirmation")
  .get(() => {
    return this._passwordConfirmation;
  })
  .set((value) => {
    this._passwordConfirmation = value;
  });

userSchema
  .virtual("originalPassword")
  .get(() => {
    return this._originalPassword;
  })
  .set((value) => {
    this._originalPassword = value;
  });

userSchema
  .virtual("currentPassword")
  .get(() => {
    return this._currentPassword;
  })
  .set((value) => {
    this._currentPassword = value;
  });

userSchema
  .virtual("newPassword")
  .get(() => {
    return this._newPassword;
  })
  .set((value) => {
    this._newPassword = value;
  });

// 비밀번호 검증
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;
var passwordRegexErrorMessage =
  "8글자 이상, 영문, 숫자, 특수문자를 조합하여 비밀번호를 입력해주세요";
userSchema.path("password").validate(function (v) {
  var user = this;
  // 사용자 생성
  if (user.isNew) {
    if (!user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호 한 번 더 입력해주세요");
    }

    if (!passwordRegex.test(user.password)) {
      user.invalidate("password", passwordRegexErrorMessage);
    } else if (user.password !== user.passwordConfirmation) {
      user.invalidate("passwordConfirmation", "비밀번호가 일치하지 않습니다");
    }
  }

  // 사용자 정보 변경
  if (!user.isNew) {
    if (!user.currentPassword) {
      user.invalidate("currentPassword", "Current Password is required!");
    } else if (
      !bcrypt.compareSync(user.currentPassword, user.originalPassword)
    ) {
      user.invalidate("currentPassword", "Current Password is invalid!");
    }

    if (user.newPassword && !passwordRegex.test(user.newPassword)) {
      user.invalidate("newPassword", passwordRegexErrorMessage);
    } else if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate(
        "passwordConfirmation",
        "Password Confirmation does not matched!"
      );
    }
  }
});

//DB 저장 전 비빌번호 암호화
userSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) {
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password);
    return next();
  }
});

//비밀번호 검증
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

const User = mongoose.model("user", userSchema);
module.exports = User;
