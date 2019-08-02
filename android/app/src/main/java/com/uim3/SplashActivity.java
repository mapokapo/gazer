package com.uim3;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.uim3.MainActivity;

public class SplashActivity extends AppCompatActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);

      Intent intent = new Intent(this, MainActivity.class);
      startActivity(intent);
      finish();
  }
}